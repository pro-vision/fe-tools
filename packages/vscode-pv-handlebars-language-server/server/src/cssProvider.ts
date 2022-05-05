import * as path from "path";
import { Location, Range } from "vscode-languageserver/node";
import { URI } from "vscode-uri";
import * as globby from "globby";
import * as postcssScss from "postcss-scss";
import * as selectorParser from "postcss-selector-parser";

import { basename, getComponentsRootPath, getFrontendRootPath, readFile, stat, toUnixPath } from "./helpers";
import type { Root } from "postcss";

// list of rules found in each scss file and the lastModified date of that file when rules were read
const cachedClassRules: Record<string, { lastModified: number; rules: CSSClassInfo[] }> = {};

/**
 * ["a", "b,c"] => [[a,b], [a,c]]
 *
 * @param {string[]} selectors - selector which also can have comma in them
 * @returns {string[][]}
 */
function splitRulesByComma(selectors: string[]): string[][] {
  let oldArr: string[][] = [[]];
  selectors.forEach(selector => {
    // skip stuff like `:is(.selected, .inRange)` for simplicity reasons.
    if (selector.includes("(")) return;

    const newArr: string[][] = [];
    selector.split(",").forEach(part => {
      const tempArr = [...oldArr.map(a => [...a, part])];
      newArr.push(...tempArr);
    });
    oldArr = newArr;
  });
  return oldArr;
}

interface CSSClassInfo {
  filePath: string;
  className: string;
  start: { line: number; column: number };
  end: { line: number; column: number };
  selector: string;
}

/**
 * extracts the position and className from all css rules in scss files
 *
 * @param {string} feSrcRoot - path to frontend's src folder
 * @returns {Promise<CSSClassInfo[]>}
 */
export async function getClassRules(feSrcRoot: string): Promise<CSSClassInfo[]> {
  const scssFilesGlob = path.join(feSrcRoot, "/**/*.scss");
  const list: CSSClassInfo[] = [];

  for await (const filePath of globby.stream(toUnixPath(scssFilesGlob))) {
    const { mtime } = await stat(filePath);
    const lastModified = mtime.getTime();
    // the files current content is already analysed and cached
    if (cachedClassRules?.[filePath as string]?.lastModified === lastModified) {
      list.push(...cachedClassRules[filePath as string].rules);
      continue;
    }

    const fileRules: CSSClassInfo[] = [];

    const fileContent = await readFile(filePath, { encoding: "utf-8" });

    let ast: Root;

    try {
      ast = postcssScss.parse(fileContent);
    } catch (error) {
      console.log("error css parsing: ", filePath, error);
      continue;
    }

    ast.walk(node => {
      if (node.type !== "rule") return;
      // list of selectors from current till root ancestor
      const combinedSelectors: string[] = [];
      let currentNode = node;
      while (currentNode.parent) {
        if (currentNode.selector) combinedSelectors.push(currentNode.selector);
        // @ts-ignore - if type is changed to container. the selector property is checked
        currentNode = currentNode.parent;
      }
      const singleCombinedSelectors = splitRulesByComma(combinedSelectors);
      // simple scss's nested selector and usage of & to css selector convertor
      const cssSelectors = singleCombinedSelectors.map(listItem =>
        listItem.reverse().reduce((combSelector, selector) => {
          return selector.includes("&") ? selector.replace("&", combSelector) : `${combSelector} ${selector}`;
        }, ""),
      );

      cssSelectors.forEach(cssSelector => {
        try {
          const lastSelector = selectorParser().astSync(cssSelector).nodes[0].nodes.reverse()[0];

          // only provides support for css rules for classes,
          // empty string in case the file doesn't have any css classes
          if (lastSelector && lastSelector.type === "class") {
            const className = lastSelector.value;
            const cssClassInfo = {
              filePath: filePath as string,
              className,
              start: node.source!.start!,
              end: node.source!.end!,
              selector: node.selector,
            };
            list.push(cssClassInfo);
            fileRules.push(cssClassInfo);
          }
        } catch (err) {
          // i.e. some parse error
          console.log(err);
        }
      });
    });

    cachedClassRules[filePath as string] = {
      lastModified,
      rules: fileRules,
    };
  }
  return list;
}

/**
 * returns all places in scss files where the given css class is styled.
 *
 * @param {string} targetClassName - className which its usage in scss file are searched for
 * @param {string} filePath - path to the hbs file where the css class was used in. (scss for this component has presedence over other files in the retruned list)
 * @returns
 */
export async function getCssClassDeclarationLocation(
  targetClassName: string,
  filePath: string,
): Promise<Location[] | null> {
  // in case of e.g "".../pva-e-button.hbs", pva-e-button will be the component name.
  // in page template it is not the case but that has no negative effect
  const compName = basename(filePath);
  const frontendRootPath = getFrontendRootPath(getComponentsRootPath(filePath));
  const feSrcRoot = path.join(frontendRootPath, "/src");
  const classRules = await getClassRules(feSrcRoot);
  const defs = classRules
    .filter(({ className }) => className === targetClassName)
    // definition in the .scss file for the current hbs component file has a higher priority
    // then the css declaration with more lines which is probably the main css implementation
    .sort(
      (defA, defZ) =>
        defZ.end.line - defZ.start.line + (basename(defZ.filePath) === compName ? 100 : 0) -
        defA.end.line - defA.start.line + (basename(defA.filePath) === compName ? 100 : 0),
    );

  return defs.map(def =>
    Location.create(
      URI.file(def.filePath).toString(),
      Range.create(
        // vscode needs zero based indices
        def.start.line - 1, def.start.column,
        def.start.line - 1, def.start.column + def.selector.length - 1,
      ),
    ),
  );
}
