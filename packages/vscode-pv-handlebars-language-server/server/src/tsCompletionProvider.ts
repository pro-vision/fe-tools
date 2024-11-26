import { CompletionItem, CompletionItemKind, Position } from "vscode-languageserver/node";
import type { TextDocument } from "vscode-languageserver-textdocument";

import { basename, getCssClasses } from "./helpers";
import rgx from "./rgx";

// finds all the class properties that have kluntje's `@uiElements` decorator
async function getUIProperties(fileContent: string) {
  const regex = new RegExp(rgx.ts.uiDecoratorPropertyName(), "g");
  const uis: string[] = [];

  let matches;
  while ((matches = regex.exec(fileContent)) !== null) {
    uis.push(matches.groups!.ui);
  }

  return uis;
}

/**
 * provide completion suggestion for the current position in the handlebars file
 * @param {TextDocument} document - current document
 * @param {Position} position - current position
 * @param {string} filePath - absolute unix path to the current document
 * @returns {Promise<CompletionItem[] | null>}
 */
export async function tsCompletionProvider(
  document: TextDocument,
  position: Position,
  filePath: string,
): Promise<CompletionItem[] | null> {
  const offset = document.offsetAt(position);
  const originalText = document.getText();
  // the file content from beginning till the current cursor position
  let text = originalText.slice(0, offset);

  // `@uiElement("` and `@uiElements("`
  if (rgx.ts.endsWithUiDecoratorSelector().test(text)) {
    const cssClasses = await getCssClasses(filePath);
    const classes = Array.from(new Set(cssClasses.map(({ className }) => className)));
    return classes.map(className => ({
      label: "." + className,
      kind: CompletionItemKind.Value,
      insertText: text.endsWith(".") ? className : `.${className}`,
      // start the list with css classes belonging to the same component
      sortText: `${className.startsWith(basename(filePath)) ? "00" : ""}${className}`,
    }));
  }
  // @uiEvent<T>()
  else if (rgx.ts.endsWithEventDecoratorElementName().test(text)) {
    const uis = await getUIProperties(originalText);
    return uis.map(ui => ({
      label: ui,
      kind: CompletionItemKind.Value,
    }));
  }
  // @eventListener({ ... target: "
  else if (rgx.ts.endsWithEventListenerDecoratorTarget().test(text)) {
    const suggestions = [];
    // only when user hasent used "." before. otherwise obviosuly they are using some classes and that can't be mixed with ui references
    if (!/"[^"]*\.[^"]*$/.test(text)) {
      const uis = await getUIProperties(originalText);
      suggestions.push(
        ...uis.map(ui => ({
          label: ui,
          kind: CompletionItemKind.Value,
          // start the list with uiElements
          sortText: `00${ui}`,
        })),
      );
    }

    const cssClasses = await getCssClasses(filePath);
    const classes = Array.from(new Set(cssClasses.map(({ className }) => className)));
    suggestions.push(
      ...classes.map(className => ({
        label: "." + className,
        kind: CompletionItemKind.Value,
        insertText: text.endsWith(".") ? className : `.${className}`,
        // continue the list with css classes belonging to the same component
        // and the the end any other css (e.g. grid, helpers, etc)
        sortText: `${className.startsWith(basename(filePath)) ? "11" : ""}${className}`,
      })),
    );

    return suggestions;
  }

  return null;
}
