import type { TextDocument } from "vscode-languageserver-textdocument";
import type { Hover, Position } from "vscode-languageserver/node";

import { handlebarsHelpersNames, pvHandlebarsHelperNames } from "./hbsHelpers";
import { isHelper, getCurrentSymbolsName } from "./helpers";

export function hoverProvider(document: TextDocument, position: Position): Hover | null {
  const originalText = document.getText();
  const offset = document.offsetAt(position);
  const textBefore = originalText.slice(0, offset);

  const symbolName = getCurrentSymbolsName(document, position);

  if (isHelper(textBefore)) {
    if (handlebarsHelpersNames.includes(symbolName))
      return {
        contents: {
          kind: "plaintext",
          value: `https://github.com/helpers/handlebars-helpers#${symbolName}`,
        },
      };
    if (pvHandlebarsHelperNames.includes(symbolName))
      return {
        contents: {
          kind: "plaintext",
          value: `https://github.com/pro-vision/fe-tools/tree/master/packages/handlebars-helpers#${symbolName}`,
        },
      };
  }

  return null;
}
