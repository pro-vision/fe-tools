import { Location, Range } from "vscode-languageserver/node";
import { URI } from "vscode-uri";
import * as babelParser from "@babel/parser";
import babelTraverse from "@babel/traverse";

import { readFile } from "./helpers";

export async function getCustomElementsClassDeclarationLocation(filePath: string): Promise<Location | null> {
  try {
    const code = await readFile(filePath, { encoding: "utf-8" });
    const ast = babelParser.parse(code, {
      sourceType: "module",
      plugins: ["typescript", "classProperties", "decorators-legacy"],
    });
    let result: [number, number, number, number];
    babelTraverse(ast, {
      // get the start position of the CE class
      ClassDeclaration: nodePath => {
        result = [
          // vscode needs zero based indices
          nodePath.node.loc?.start.line! - 1, nodePath.node.loc?.start.column!,
          nodePath.node.loc?.end.line! - 1, nodePath.node.loc?.end.column!,
        ];
      },
    });

    // @ts-ignore
    if (result !== undefined) return Location.create(URI.file(filePath).toString(), Range.create(...result));
  } catch {
    // parse error when code has some syntax issues
  }

  return null;
}
