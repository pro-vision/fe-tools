import * as path from "path";
import { CompletionItem, CompletionItemKind, InsertTextFormat, Position } from "vscode-languageserver/node";
import type { TextDocument } from "vscode-languageserver-textdocument";

import { getParameters } from "./parameterExtractor";
import { getAllHelperNames } from "./hbsHelpers";
import {
  hasUnclosedQuote,
  getPartialFile,
  isHelper,
  isPVArchetype,
  getPartials,
  getDataFiles,
  getComponentsRootPath,
  getHbsContent,
  basename,
  getPVConfig,
  getFrontendRootPath,
} from "./helpers";
import { getClassRules } from "./cssProvider";
import SettingsService from "./SettingsService";

/**
 * provide completion suggestion for the current position in the handlebars file
 * @param {TextDocument} document - current document
 * @param {Position} position - current position
 * @param {string} filePath - absolute unix path to the current document
 * @returns {Promise<CompletionItem[] | null>}
 */
export async function completionProvider(
  document: TextDocument,
  position: Position,
  filePath: string,
): Promise<CompletionItem[] | null> {
  // info such as possible partials, their parameter and helpers can only be really provided for an assemble-lite project
  if (!isPVArchetype(filePath)) return null;
  const offset = document.offsetAt(position);
  const originalText = document.getText();
  // the file content from beginning till the current cursor position
  let text = originalText.slice(0, offset);
  const textAfter = originalText.slice(offset);

  const lastClosing = text.lastIndexOf("}}");
  const lastOpening = text.lastIndexOf("{{");
  const componentsRootPath = getComponentsRootPath(filePath);

  // is inside a hbs double curly bracket pair
  if (lastOpening > lastClosing && text[lastOpening + 2] !== "!") {
    // start after the last opening {{
    text = text.slice(lastOpening);

    // partial name e.g. `{{> parti`
    if (/^{{#?>\s*[a-zA-Z0-9_-]+$/.test(text)) {
      const partials = await getPartials(componentsRootPath);
      return (
        partials
          // don't suggest the current file as a partial option
          .filter((partial) => partial.path !== filePath)
          .map(({ name }) => ({
            label: name,
            kind: CompletionItemKind.Property,
          }))
      );
    }

    // partial parameter/context. e.g `{{> partial this someKe`
    if (
      /^{{#?>\s*(?<partialName>[a-zA-Z0-9_-]+)\s+(?<params>((@*[a-zA-Z0-9_.-]+)\s+)*)(?<hash>([a-zA-Z0-9_.-]+\s*=\s*(@*[a-zA-Z0-9_.-]+|"(.|\s)*"|\(.*\))\s+)*)[a-zA-Z0-9_-]*$/.test(
        text,
      )
    ) {
      const regExMatch = text.match(
        /^{{#?>\s*(?<partialName>[a-zA-Z0-9_-]+)\s+(?<params>((@*[a-zA-Z0-9_.-]+)\s+)*)(?<hash>([a-zA-Z0-9_.-]+\s*=\s*(@*[a-zA-Z0-9_.-]+|"(.|\s)*"|\(.*\))\s+)*)[a-zA-Z0-9_-]*$/,
      );
      const hash = regExMatch?.groups?.hash;
      const partialName = regExMatch?.groups?.partialName;

      // remove used attr names
      const usedParameters = hash ? hash.match(/([a-zA-Z0-9_.-]+)\s*=/g)!.map(m => m.split("=")[0].trim()) : [];
      const partialFilePath = await getPartialFile(componentsRootPath, partialName!);
      const hbsTemplate = partialFilePath ? await getHbsContent(partialFilePath) : "";

      const partialParameters: string[] = getParameters(hbsTemplate);

      return partialParameters
        .filter(pName => !usedParameters.includes(pName))
        .map(pName => ({
          label: pName,
          kind: CompletionItemKind.Value,
          insertText: `${pName}=`,
        }));
    }

    // helper or context. e.g `{{#withLas` or `{{someVa`
    if (isHelper(text)) {
      // only provide completion for block helpers e.g. `{{#each` and Subexpressions e.g. `(lookup foo bar)`.
      // BUT not expressions e.g. `{{foo}}` which is ambiguous whether it uses a helper or a basic expression for data interpolations
      // which users mostly use and suggesting helpers will get in the way
      if (/^{{[a-zA-Z0-9_-]+$/.test(text)) return null;

      const allHelpers = await getAllHelperNames(componentsRootPath);

      const helperCompletions: CompletionItem[] = allHelpers.map(helperName => {
        return {
          label: helperName,
          kind: CompletionItemKind.Function,
        };
      });

      const isBlockHelper = /#[a-zA-Z0-9_-]+$/.test(text);
      // VSCode needs the "#" as part of the symbol name
      if (isBlockHelper) {
        helperCompletions.forEach(completion => {
          completion.filterText = `#${completion.label}`;
          completion.insertText = `#${completion.label}`;
        });
      }

      // it is probably a new opened block helper when `}}` follows the current caret's position, add the closing tag on commit key.
      // if the current caret is followed by other characters e.g. `{{#eac| this}}` or `{{# eac|unless...`,
      // then probably the user is trying to rename an existing block helper.
      // in that case maybe renaming the closing tag e.g. via `textEdit` would also be an option. but no need to add the closing tag
      if (textAfter.startsWith("}}")) {
        helperCompletions.forEach(completion => {
          completion.insertText = `#${completion.label} $1}}$0{{/${completion.label}`;
          completion.insertTextFormat = InsertTextFormat.Snippet;
        });
      }

      return helperCompletions;
    }

    // closing block helper e.g. `{{/withLas`
    if (/^{{\/[a-zA-Z0-9_-]*$/.test(text)) {
      const allHelpers = await getAllHelperNames(componentsRootPath);

      return allHelpers.map(helperName => {
        return {
          label: helperName,
          kind: CompletionItemKind.Function,
          // also possible to find the last unclosed helper block and `preselect` it.
        };
      });
    }

    // root context e.g. `@root.main-na`
    if (/@root\.[a-zA-Z0-9_-]*$/.test(text)) {
      const dataNames = await getDataFiles(componentsRootPath);
      return dataNames.map(({ name }) => ({
        label: name,
        kind: CompletionItemKind.Property,
      }));
    }

    // @data variables (@see https://handlebarsjs.com/api-reference/data-variables.html#data-variables). e.g. `@inde`
    // starting with "@" and not in quote
    if (/@[a-zA-Z0-9_-]*$/.test(text) && !hasUnclosedQuote(text)) {
      const AT_DATA_VARIABLES = ["root", "first", "index", "key", "last", "level"];

      return AT_DATA_VARIABLES.map(varName => ({
        // show in the selection list with the "@" sign
        label: `@${varName}`,
        kind: CompletionItemKind.Variable,
        // VSCode doesn't see the "@" as part of variable and filters by the first letter
        insertText: varName,
        filterText: varName,
      }));
    }
  }

  // class="class-name {{#hbs}} other-class-name{{/}}"
  if (/class="\s*(([a-zA-Z0-9_-]+\s+)|{{.*}}\s+)*[a-zA-Z0-9_-]*$/.test(text)) {
    const settings = await SettingsService.getDocumentSettings(document.uri);
    if (!settings.provideCssClassCompletion) return null;

    const frontendRootPath = getFrontendRootPath(componentsRootPath);
    const feSrcRoot = path.join(frontendRootPath , "/src");
    const pvConfig = getPVConfig(frontendRootPath);

    const rules = await getClassRules(feSrcRoot);
    const classNames = Array.from(new Set(rules.map(rule => rule.className)));
    const namespace = pvConfig?.namespace || "";

    return classNames
        .map(className => ({
          label: className,
          kind: CompletionItemKind.Value,
          // start the list with css classes belonging to the same component as the partial,
          // then the project classes
          // then the author and 3rd party plugins'
          sortText: `${className.startsWith(basename(filePath)) ? "00" : ""}${className.startsWith(namespace) ? "11" : ""}${className}`,
        }));
  }

  return null;
}
