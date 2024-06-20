import { Location, Range } from "vscode-languageserver/node";
import { URI } from "vscode-uri";
import * as babelParser from "@babel/parser";
import babelTraverse, { type NodePath } from "@babel/traverse";
import type {
  CallExpression,
  Identifier,
  StringLiteral,
  ObjectExpression,
  ObjectProperty,
  ClassMethod,
  ClassProperty,
} from "@babel/types";

import { readFile } from "./helpers";

// get AST of a typescript file
async function getAST(filePath: string) {
  try {
    const code = await readFile(filePath, { encoding: "utf-8" });
    const ast = babelParser.parse(code, {
      sourceType: "module",
      plugins: ["typescript", "classProperties", "decorators-legacy"],
    });
    return ast;
  } catch {
    // parse error when code has some syntax issues
    return null;
  }
}

export async function isKluntjeComponent(filePath: string) {
  const ast = await getAST(filePath);
  if (!ast) return null;

  let result = false;
  babelTraverse(ast, {
    ImportDeclaration(node) {
      // importing any modules from kluntje/core is a good enough indicator for a custom element being based a kluntje component
      if (node.node.source.value === "@kluntje/core") result = true;
    },
  });

  return result;
}

// provides the start and end location of the custom element declaration, assuming it is the only class in the file.
export async function getCustomElementsClassDeclarationLocation(filePath: string): Promise<Location | null> {
  const ast = await getAST(filePath);
  if (!ast) return null;

  let result: [number, number, number, number];

  babelTraverse(ast, {
    // get the start position of the CE class
    ClassDeclaration: nodePath => {
      result = [
        // vscode needs zero based indices
        nodePath.node.loc?.start.line! - 1,
        nodePath.node.loc?.start.column!,
        nodePath.node.loc?.end.line! - 1,
        nodePath.node.loc?.end.column!,
      ];
    },
  });

  // @ts-ignore
  if (result !== undefined) return Location.create(URI.file(filePath).toString(), Range.create(...result));

  return null;
}

// [line, character]
type CodeLocation = [number, number];

/*
  @uiElements(".e-btn")
  ctas: HTMLElement[]
*/
type UiInfo = {
  name: string; // e.g. "ctas"
  selector: string; // e.g. ".e-btn"
  isArray: boolean; // i.e. using `@uiElements` instead of `@uiElement`
  location: CodeLocation;
};

/*
  @uiEvent("ctas", "click")
  handleCtaClick(){}
*/
type EventInfo = {
  name: string; // e.g. "click"
  methodName: string; // e.g. "handleCtaClick"
  location: CodeLocation;
};

// returns a list of used @uiElement(s), @uiEvents, etc. and their location in the file
export async function getCustomElementsUIAndEvents(filePath: string) {
  const ast = await getAST(filePath);
  if (!ast) return null;

  const uis: Array<UiInfo> = [];

  const events: Array<{
    events: Array<EventInfo>;
    target: string; // e.g. "cta" or ".e-btn" in case of `@eventListener`
  }> = [];

  function extractUiAndEvent(nodePath: NodePath<ClassMethod> | NodePath<ClassProperty>) {
    const propName = (nodePath.node.key as Identifier).name;
    // currently all kluntje component decorators are functions
    const decorators = nodePath.node.decorators
      ?.filter(decoratorNode => decoratorNode.expression.type === "CallExpression")
      .map(decoratorNode => decoratorNode.expression as CallExpression);

    if (decorators) {
      decorators.forEach(decorator => {
        const name = (decorator.callee as Identifier).name;
        // `@uiElement(".selector")` and `@uiElements(".selector")`
        // ignore e.g. `@uiElement(SOME_VARIABLE)`
        if ((name === "uiElement" || name === "uiElements") && decorator.arguments[0].type === "StringLiteral") {
          const selector = decorator.arguments[0].value;
          uis.push({
            name: propName,
            selector,
            location: [nodePath.node.key.loc!.start.line! - 1, nodePath.node.key.loc!.start.column!],
            isArray: name === "uiElements",
          });
        }
        // @uiEvent("cta", "click") & @uiEvent("cta", SOME_EVENT)
        else if (name === "uiEvent") {
          // ignore any `@uiEvent(SOME_VARIABLE, )`
          if (decorator.arguments[0].type !== "StringLiteral") return;
          if (decorator.arguments[1].type !== "StringLiteral" && decorator.arguments[1].type !== "Identifier") return;

          const args = decorator.arguments as StringLiteral[];
          const elementName = decorator.arguments[0] as StringLiteral;
          const eventName = decorator.arguments[1] as StringLiteral | Identifier;
          let eventNames: string[] = [];
          // e.g. @uiEvent(, "focus input")
          if (eventName.type === "StringLiteral") eventNames = eventName.value.split(" ");
          // e.g. `@uiEvent(, SOME_VARIABLE)`
          else if (eventName.type === "Identifier") eventNames = [eventName.name];
          events.push({
            target: elementName.value,
            events: eventNames.map(eventName => ({
              name: eventName,
              methodName: propName,
              location: [args[1].loc!.start.line! - 1, args[1].loc!.start.column! + 1],
            })),
          });
        }
        // @eventListener({event: "click", target: ".selector"}) and @eventListener({events: ["click", "scroll"], target: ".selector"})
        else if (name === "eventListener") {
          const properties = (decorator.arguments as ObjectExpression[])[0].properties as ObjectProperty[];
          let evs: string[] = [];
          let target: string = "";

          properties.forEach(prop => {
            // ignore `target(){}`
            if (prop.type !== "ObjectProperty" || prop.key.type !== "Identifier") return;

            if (prop.key.name === "event" && prop.value.type === "StringLiteral") {
              evs.push(prop.value.value);
            } else if (prop.key.name === "events" && prop.value.type === "ArrayExpression") {
              prop.value.elements.forEach(val => {
                if (val?.type === "StringLiteral") evs.push(val.value);
              });
            } else if (prop.key.name === "target" && prop.value.type === "StringLiteral") {
              target = prop.value.value;
            }
          });

          if (target && evs.length) {
            events.push({
              target,
              events: evs.map(name => ({
                name,
                methodName: propName,
                location: [
                  // pass the location of the decorator itself, instead of each event string individually which is more work
                  // vscode needs zero based indices
                  decorator.loc?.start.line! - 1,
                  // 1 to left for the "@" character
                  decorator.loc?.start.column! - 1,
                ],
              })),
            });
          }
        }
      });
    }
  }

  babelTraverse(ast, {
    ClassProperty(nodePath) {
      extractUiAndEvent(nodePath);
    },

    ClassMethod(nodePath) {
      extractUiAndEvent(nodePath);
    },
  });

  const selectors: Record<
    string, // e.g. ".e-btn"
    {
      ui?: {
        name: string; // e.g. ctas
        location: CodeLocation;
        isArray: boolean;
      };
      events: Array<EventInfo>;
    }
  > = {};

  // e.g. "button, .e-cta" => ["button", ".e-cta"]
  const getSelectors = (value: string) => value.split(",").map(s => s.trim());

  uis.forEach(({ name, selector, location, isArray }) => {
    getSelectors(selector).forEach(
      s =>
        (selectors[s] = {
          ui: {
            name,
            location,
            isArray,
          },
          events: [],
        }),
    );
  });

  events.forEach(event => {
    if (event.target) {
      const item = Object.entries(selectors).find(([_s, value]) => value.ui?.name === event.target);
      if (item) item[1].events.push(...event.events);
      else {
        getSelectors(event.target).forEach(s => {
          selectors[s] = selectors[s] ?? { events: [] };
          selectors[s].events.push(...event.events);
        });
      }
    }
  });

  return selectors;
}
