import { Location, Position } from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import { isPVArchetype, getCurrentSymbolsName, getCssClasses, getPositionAt } from "./helpers";
import rgx from "./rgx";

export async function tsDefinitionProvider(
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
  // `.some-selector` and not `uiProp`
  const isCssClassSelector = /\.[a-zA-Z_-]+$/.test(textBefore);

  // `@uiElement("` and `@uiElements("` or `// @eventListener({ ... target: ".class`
  if (
    rgx.ts.endsWithUiDecoratorSelector().test(textBefore) ||
    (rgx.ts.endsWithEventListenerDecoratorTarget().test(textBefore) && isCssClassSelector)
  ) {
    const cssClasses = await getCssClasses(filePath);
    return cssClasses
      .filter(cssClass => cssClass.className === symbolName)
      .map(cssClass => Location.create(URI.file(cssClass.location.filePath).toString(), cssClass.location.range));
  }
  // `@uiEvent("uiProp` or `@eventListener({ ... target: "uiProp`
  else if (
    rgx.ts.endsWithEventDecoratorElementName().test(textBefore) ||
    (rgx.ts.endsWithEventListenerDecoratorTarget().test(textBefore) && !isCssClassSelector)
  ) {
    const uiMatch = originalText.match(new RegExp(`@uiElements?\\(.+?\\)\\s*${symbolName}`));
    if (uiMatch) {
      const deco = uiMatch[0].match(/@uiElements?\(.+?\)\s*/)![0];
      const start = getPositionAt(originalText, uiMatch.index! + deco.length);
      return Location.create(document.uri, {
        start,
        end: {
          line: start.line,
          character: start.character + symbolName.length,
        },
      });
    }
  }
  return null;
}
