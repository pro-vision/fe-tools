import { Location, Range, Position } from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import * as globby from "globby";
import * as yamlFront from "yaml-front-matter";
import * as Handlebars from "handlebars";

import { getCustomHelpers } from "./hbsHelpers";
import {
  getPartialFile,
  getFileContent,
  isPartial,
  isHelper,
  isPartialParameter,
  isPVArchetype,
  getCurrentSymbolsName,
  readFile,
  getDataFiles,
  getLayoutFiles,
} from "./helpers";
import { getCustomElementsClassDeclarationLocation } from "./customElementDefinitionProvider";
import { getCssClassDeclarationLocation } from "./cssProvider";
import SettingsService from "./SettingsService";

// finds the first expression in the ast with the provided name
class Visitor extends Handlebars.Visitor {
  public targetNode: hbs.AST.PathExpression | null = null;

  constructor(public targetName: string) {
    super();
  }

  PathExpression(path: hbs.AST.PathExpression): void {
    const name = path.parts[0];

    if (name === this.targetName && !this.targetNode) {
      this.targetNode = path;
    }

    super.PathExpression(path);
  }
}

export async function definitionProvider(
  document: TextDocument,
  position: Position,
  filePath: string,
): Promise<Location | Location[] | null> {
  // simple check if it is a component ala p!v archetype
  if (!isPVArchetype(filePath)) return null;

  const offset = document.offsetAt(position);
  const originalText = document.getText();
  const textBefore = originalText.slice(0, offset);

  const symbolName = getCurrentSymbolsName(document, position);

  const componentsRootPath = filePath.includes("src/components/")
    ? `${filePath.split("/frontend/src/components")[0]}/frontend/src/components`
    : filePath.includes("src/pages/")
      ? `${filePath.split("/frontend/src/pages")[0]}/frontend/src/components`
      : `${filePath.split("/frontend/src/layouts")[0]}/frontend/src/components`;

  // e.g. {{> partial
  if (isPartial(textBefore)) {
    const partialPaths = await globby(`${componentsRootPath}/**/${symbolName}.hbs`);

    if (partialPaths.length) {
      const fileContent = await readFile(partialPaths[0], { encoding: "utf-8" });
      const hbsCode = yamlFront.loadFront(fileContent).__content.trim();
      const hbsStart = fileContent.indexOf(hbsCode);
      const before = fileContent.slice(0, hbsStart);
      const lineNumber = (before.match(/\n/g) || []).length;
      const totalLineNumbers = (fileContent.match(/\n/g) || []).length + 1; // +1 incase there is no eol at the end

      return Location.create(URI.file(partialPaths[0]).toString(), Range.create(lineNumber, 0, totalLineNumbers, 0));
    }
  }
  // e.g. {{> partial param
  if (isPartialParameter(textBefore)) {
    const lastClosing = textBefore.lastIndexOf("}}");
    const lastOpening = textBefore.lastIndexOf("{{");
    if (lastOpening > lastClosing && textBefore[lastOpening + 2] !== "!") {
      const text = textBefore.slice(lastOpening);
      const partialName = text.match(
        /^{{#?>\s*(?<partialName>[a-zA-Z0-9_-]+)\s+((([a-zA-Z0-9_-]+\s*=\s*((@*[a-zA-Z0-9_.-])+|"(.|\s)*"|\(.*\)|@*[a-zA-Z0-9_.-]+))|(@*[a-zA-Z0-9_.-]+))\s+)*(?<parameterName>[a-zA-Z0-9_-]+)$/,
      )?.groups?.partialName;
      if (partialName) {
        const partialFilePath = await getPartialFile(componentsRootPath, partialName);
        if (!partialFilePath) return null;
        const fileContent = await getFileContent(partialFilePath);
        const hbsCode = yamlFront.loadFront(fileContent).__content;

        const scanner = new Visitor(symbolName);
        scanner.accept(Handlebars.parse(hbsCode));
        if (scanner.targetNode) {
          let startLineNumber = scanner.targetNode.loc.start.line - 1; // is 1 based
          const startColumnNumber = scanner.targetNode.loc.start.column;
          let endLineNumber = scanner.targetNode.loc.start.line - 1; // is 1 based
          const endColumnNumber = scanner.targetNode.loc.end.column;

          const hbsStart = fileContent.indexOf(hbsCode);
          const before = fileContent.slice(0, hbsStart);
          const frontMatterLines = (before.match(/\n/g) || []).length;
          startLineNumber += frontMatterLines;
          endLineNumber += frontMatterLines;

          return Location.create(
            URI.file(partialFilePath).toString(),
            Range.create(startLineNumber, startColumnNumber, endLineNumber, endColumnNumber),
          );
        }
      }
    }
  }
  // e.g. `{{#helper` or {{> partial (helper
  else if (isHelper(textBefore)) {
    const customHelpers = await getCustomHelpers(componentsRootPath);
    const currentCustomHelper = customHelpers.find(helper => helper.name === symbolName);
    if (currentCustomHelper)
      return Location.create(URI.file(currentCustomHelper.path).toString(), Range.create(0, 0, 0, 0));
  }
  // {{hbs @root.data}}
  else if (/@root\.[a-zA-Z0-9_-]+$/.test(textBefore)) {
    const dataFiles = await getDataFiles(componentsRootPath);
    const dataFile = dataFiles.find(({ name }) => name === symbolName);
    if (dataFile) return Location.create(URI.file(dataFile.path).toString(), Range.create(0, 0, 0, 0));
  }
  // class="class-name {{#hbs}} other-class-name{{/}}"
  else if (/class="\s*(([a-zA-Z0-9_-]+\s+)|{{.*}}\s+)*[a-zA-Z0-9_-]+$/.test(textBefore)) {
    const settings = await SettingsService.getDocumentSettings(document.uri);
    if (settings.provideCssClassGoToDefinition) return getCssClassDeclarationLocation(symbolName, filePath);
  }
  // <custom-element
  else if (/<\/?[a-z]+[a-z0-9_-]+$/.test(textBefore) || / is="[a-z]+[a-z0-9_-]+$/.test(textBefore)) {
    // assuming filename and custom tag are the same
    const customElementFile = await globby(`${componentsRootPath}/**/${symbolName}.ts`);
    if (customElementFile.length) {
      const cePath = customElementFile[0];
      return getCustomElementsClassDeclarationLocation(cePath);
    }
  }
  /*
   layout reference in the yaml front matter:

   ---
   ...
   layout: name
   ---
  */
  else if (/^\n*---[^---]*layout:\s*(\w|\d)+$/.test(textBefore)) {
    // templates inside /page/ directory use different layouts than the open under /components/
    const isPageTemplate = filePath.includes("/frontend/src/pages");
    const layouts = await getLayoutFiles(componentsRootPath);
    const layoutFilePath = layouts?.[isPageTemplate ? "pages" : "lsg"]?.[symbolName];

    if (layoutFilePath) {
      const fileContent = await getFileContent(layoutFilePath);
      // placeholder assemble-lite uses to place content in the layout
      const BODY_PLACEHOLDER = "{% body%}";
      const placeholderStart = fileContent.indexOf(BODY_PLACEHOLDER);

      // where placeholder is placed (if found)
      if (placeholderStart !== -1) {
        const before = fileContent.slice(0, placeholderStart);
        const lineNumber = (before.match(/\n/g) || []).length;
        return Location.create(URI.file(layoutFilePath).toString(), Range.create(lineNumber, 0, lineNumber, 1000));
      }
      // whole file
      else {
        return Location.create(URI.file(layoutFilePath).toString(), Range.create(0, 0, 0, 0));
      }

    }
  }
  return null;
}
