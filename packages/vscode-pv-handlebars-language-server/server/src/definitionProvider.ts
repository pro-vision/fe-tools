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
} from "./helpers";

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
): Promise<Location | null> {
  // simple check if it is a component ala p!v archetype
  if (!isPVArchetype(filePath)) return null;

  const offset = document.offsetAt(position);
  const originalText = document.getText();
  const textBefore = originalText.slice(0, offset);

  const symbolName = getCurrentSymbolsName(document, position);

  const componentsRootPath = `${filePath.split("/frontend/src/components")[0]}/frontend/src/components`;

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
  } else if (isPartialParameter(textBefore)) {
    const lastClosing = textBefore.lastIndexOf("}}");
    const lastOpening = textBefore.lastIndexOf("{{");
    if (lastOpening > lastClosing && textBefore[lastOpening + 2] !== "!") {
      const text = textBefore.slice(lastOpening);
      const partialName = text.match(
        /^{{#?>\s*(?<partialName>[a-zA-Z0-9_-]+)\s+((([a-zA-Z0-9_-]+\s*=\s*((@*[a-zA-Z0-9_.-])+|".*"|\(.*\)|@*[a-zA-Z0-9_.-]+))|(@*[a-zA-Z0-9_.-]+))\s+)*(?<parameterName>[a-zA-Z0-9_-]+)$/,
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
  } else if (isHelper(textBefore)) {
    const customHelpers = await getCustomHelpers(componentsRootPath);
    const currentCustomHelper = customHelpers.find(helper => helper.name === symbolName);
    if (currentCustomHelper)
      return Location.create(URI.file(currentCustomHelper.path).toString(), Range.create(0, 0, 0, 0));
  } else if (/@root\.[a-zA-Z0-9_-]+$/.test(textBefore)) {
    const dataFiles = await getDataFiles(componentsRootPath);
    const dataFile = dataFiles.find(({ name }) => name === symbolName);
    if (dataFile) return Location.create(URI.file(dataFile.path).toString(), Range.create(0, 0, 0, 0));
  }
  return null;
}
