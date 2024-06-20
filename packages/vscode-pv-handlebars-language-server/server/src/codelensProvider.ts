import { basename, dirname } from "path";
import { Range, Position, Location } from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import globby = require("globby");
import { getCustomElementsUIAndEvents } from "./customElementDefinitionProvider";
import { getFilePath } from "./helpers";

const classAndTagRegEx = () => /<(?<tagName>[a-zA-Z0-9_-]+)[^>]*?(class="(?<className>[^"]*))?"/g;

/**
 * creates an object that can be consumed by onCodeLens request handler (see vscode's `CodeLens` interface for more info)
 *
 * @param {object} param0
 * @param {number} param0.line - zero based line number of where the codeLens should be shown
 * @param {string} param0.title - text of the code Lens
 * @param {[number, number]} param0.location - clicking on the codeLens should bring the user to this code location [line, character]
 * @param {string} param0.uri - path to the the file which user is moved to once they click on the codeLens
 * @returns
 */
const createLens = ({
  line,
  title,
  location,
  uri,
}: {
  line: number;
  title: string;
  location: [number, number];
  uri: string;
}) => ({
  range: Range.create(Position.create(line, 0), Position.create(line, 0)),
  command: {
    title,
    command: "P!VHandlebarsLanguageServer.codelensAction",
    arguments: [Location.create(uri, Range.create(Position.create(...location), Position.create(...location)))],
  },
});

// finds all @uiElement, @uiEvent etc and highlights those in the hbs
export async function codelensProvider(textDocument: TextDocument) {
  const codeLenses = [];

  const filePath = getFilePath(textDocument);
  const dir = dirname(filePath);
  const name = basename(dir);

  // assuming the main custom element has the same as the directory name of the current hbs file
  const customElementFile = await globby(`${dir}/${name}.ts`);
  if (!customElementFile.length) return null;

  const cePath = customElementFile[0];

  const selectors = await getCustomElementsUIAndEvents(customElementFile[0]);
  if (!selectors) return null;

  const content = textDocument.getText();
  const regex = classAndTagRegEx();
  let matches;

  while ((matches = regex.exec(content)) !== null) {
    for (const [selector, item] of Object.entries(selectors)) {
      const classMatch =
        selector.startsWith(".") && matches.groups!.className?.split(" ").includes(selector.replace(/^./, ""));
      const tagMatch = matches.groups!.tagName === selector;
      if (classMatch || tagMatch) {
        const line = content.substring(0, matches.index).split("\n").length - 1;

        if (item.ui) {
          codeLenses.push(
            createLens({
              line,
              title: item.ui.name + (item.ui.isArray ? "[]" : ""),
              location: item.ui.location,
              uri: cePath,
            }),
          );
        }
        item.events.forEach(ev => {
          codeLenses.push(createLens({ line, title: "@" + ev.name, location: ev.location, uri: cePath }));
        });
      }
    }
  }

  return codeLenses;
}
