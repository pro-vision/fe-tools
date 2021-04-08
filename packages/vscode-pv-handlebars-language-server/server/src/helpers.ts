import * as path from "path";
import * as fs from "fs";
import { promisify } from "util";
import * as globby from "globby";
import * as yamlFront from "yaml-front-matter";
import { URI } from "vscode-uri";
import type { Position } from "vscode-languageserver/node";
import type { TextDocument } from "vscode-languageserver-textdocument";

interface PVConfig {
  hbsHelperSrc?: string;
}

/**
 * `fs.readFile` but returns a Promise
 */
export const readFile = promisify(fs.readFile);

/**
 * convert filepath to a unix path with forwarding slashes
 * @param {string} filePath - filepath with unix or windows separator
 * @returns {string}
 */
export function toUnixPath(filePath: string): string {
  return filePath.replace(/\\/g, "/");
}

/**
 * returns the base name of the file till the last dot
 *
 * @param {string} filePath - absolute or relative path to a file
 * @returns {string}
 */
export function basename(filePath: string): string {
  const baseNameWithExtension = path.basename(toUnixPath(filePath));
  return baseNameWithExtension.slice(0, baseNameWithExtension.lastIndexOf("."));
}

/**
 * returns absolute unix path to the provided TextDocument
 * @param {TextDocument} document
 * @returns {string}
 */
export function getFilePath(document: TextDocument): string {
  const fsPath = URI.parse(document.uri).fsPath;
  // convert to unix paths
  return toUnixPath(fsPath);
}

/**
 * returns true if the .hbs file's path seams to belong to a repo with the p!v fe archetype structure
 * @param {string} templatePath - absolute path (with unix separators) to a hbs file
 * @returns {boolean}
 */
export function isPVArchetype(templatePath: string): boolean {
  return templatePath.includes("/frontend/src/components") || templatePath.includes("/frontend/src/pages");
}

/**
 * returns path to the frontend/src/components folder which this e.g. hbs file belongs to
 * @param {string} filePath - path to an existing file (unix sep.) in a frontend/src folder in a project
 * @returns {string}
 */
export function getComponentsRootPath(filePath: string): string {
  if (!isPVArchetype(filePath)) throw new Error("template seems not to belong to a p!v project");

  return `${filePath.split("/frontend/src/")[0]}/frontend/src/components`;
}

/**
 * returns path to the frontend root folder in a p!v FE archetype based project
 * @param {string} componentsRootPath - path to frontend/src/components in a p!v FE archetype based project
 * @returns {string}
 */
export function getFrontendRootPath(componentsRootPath: string): string {
  return path.join(componentsRootPath, "../../");
}

/**
 * returns pv.config.js content as json or null when non exists
 * @param {string} frontendRootPath - frontend root folder in a p!v FE archetype based project
 * @returns {PVConfig | null}
 */
export function getPVConfig(frontendRootPath: string): PVConfig | null {
  try {
    const pvConfigPath = path.join(frontendRootPath, "pv.config.js");
    // eslint-disable-next-line
    const pvConfig: PVConfig = require(pvConfigPath);
    return pvConfig;
  } catch {
    // pv.config.js did not exist
    return null;
  }
}

/**
 * returns the absolute path to the handlebars file which provides the hbs partial for the given name
 * returns null when nothing is found
 * @param {string} componentsRootPath - path to src/components in a p!v fe archetype based project
 * @param {string} partialName - component name e.g. `pv-e-button` which has the `pv-e-button.hbs` partial
 * @returns {Promise<string | null>}
 */
export async function getPartialFile(componentsRootPath: string, partialName: string): Promise<string | null> {
  const partialPaths = await globby(`${componentsRootPath}/**/${partialName}.hbs`);
  return partialPaths.length ? partialPaths[0] : null;
}

/**
 * returns the list of files which will be read and used as hbs partials in a assemble-lite project
 * @param {string} componentsRootPath - path to src/components in a p!v fe archetype based project
 * @returns {Promise<Array<{ path: string, name: string }>>}
 */
export async function getPartials(componentsRootPath: string): Promise<Array<{ path: string; name: string }>> {
  const partialPaths = await globby(`${componentsRootPath}/**/*.hbs`);
  return partialPaths.map(filePath => ({ path: filePath, name: path.basename(filePath, ".hbs") }));
}

/**
 * returns the list of files which will be read and used as data file in a assemble-lite project
 * @param {string} componentsRootPath - path to src/components in a p!v fe archetype based project
 * @returns {Promise<Array<{ path: string, name: string }>>}
 */
export async function getDataFiles(componentsRootPath: string): Promise<Array<{ path: string; name: string }>> {
  const partialPaths = await globby(`${componentsRootPath}/**/*.{json,yaml,yml}`);
  return partialPaths.map(filePath => ({ path: filePath, name: basename(filePath) }));
}

// list of Handlebars helper in the provided folder which assemble-lite would use
export async function getCustomHelperFiles(componentsRootPath: string): Promise<Array<{ path: string; name: string }>> {
  const frontendRootPath = getFrontendRootPath(componentsRootPath);
  const pvConfig = getPVConfig(frontendRootPath);

  // pv.config.js did not exist or does not have custom helpers defined
  if (!pvConfig?.hbsHelperSrc) return [];

  // globby needs unix paths
  const helpersGlob = toUnixPath(path.join(frontendRootPath, pvConfig.hbsHelperSrc, "/**/*.js"));
  const helperPaths = await globby(helpersGlob);
  return helperPaths.map(filePath => ({ path: filePath, name: path.basename(filePath, ".js") }));
}

/**
 * returns text content of the file which its path is provided
 * @param {string} filePath - absolute path to the local file
 * @returns {Promise<string>}
 */
export async function getFileContent(filePath: string): Promise<string> {
  const fileContent = await readFile(filePath, { encoding: "utf-8" });
  return fileContent;
}

/**
 * checks if in the provided text there are unclosed `"` or `'`
 * @param {string} text
 * @returns {boolean}
 */
export function hasUnclosedQuote(text: string): boolean {
  return (text.match(/"|'/g) || []).length % 2 === 1;
}

/**
 * returns true if the provided text ends with the partial name in a hbs template
 * e.g. `... {{> p-name`
 * @param {string} text - part of handlebars template
 * @returns {boolean}
 */
export function isPartial(text: string): boolean {
  const lastClosing = text.lastIndexOf("}}");
  const lastOpening = text.lastIndexOf("{{");
  if (lastOpening > lastClosing && text[lastOpening + 2] !== "!") {
    text = text.slice(lastOpening);
    return /^{{#?>\s*[a-zA-Z0-9_-]+$/.test(text);
  }
  return false;
}

/**
 * returns true if the provided text ends with the helper name in a hbs template
 * e.g. `... {{#each`  or `... {{> p-name (my-hel`
 * @param {string} text - part of hbs template
 * @returns {boolean}
 */
export function isHelper(text: string): boolean {
  const lastClosing = text.lastIndexOf("}}");
  const lastOpening = text.lastIndexOf("{{");

  if (lastOpening > lastClosing && text[lastOpening + 2] !== "!") {
    text = text.slice(lastOpening);
    return /^{{#?\s*[a-zA-Z0-9_-]*$/.test(text) || (/\(\s*[a-zA-Z0-9_-]+$/.test(text) && !hasUnclosedQuote(text));
  }
  return false;
}

/**
 * returns true if the provided text ends with the hash key part in a hbs template's partial call
 * e.g. `... {{> p-name this ke`
 * @param {string} text - part of hbs template
 * @returns {boolean}
 */
export function isPartialParameter(text: string): boolean {
  const lastClosing = text.lastIndexOf("}}");
  const lastOpening = text.lastIndexOf("{{");
  if (lastOpening > lastClosing && text[lastOpening + 2] !== "!") {
    text = text.slice(lastOpening);
    return /^{{#?>\s*([a-zA-Z0-9_-]+)\s+((([a-zA-Z0-9_-]+\s*=\s*((@*[a-zA-Z0-9_.-])+|".*"|\(.*\)|@*[a-zA-Z0-9_.-]+))|(@*[a-zA-Z0-9_.-]+))\s+)*[a-zA-Z0-9_-]+$/.test(
      text,
    );
  }
  return false;
}

/**
 * returns the handlebars part of the file which might have front matter
 * @param {string} filePath - absolute path to a .hbs file
 * @returns {string}
 */
export async function getHbsContent(filePath: string): Promise<string> {
  const fileContent = await readFile(filePath, { encoding: "utf-8" });
  const hbsCode = yamlFront.loadFront(fileContent).__content.trim();
  return hbsCode;
}

/**
 * returns the full name of the word in the `document` which the provided `position` points to
 *
 * @param {TextDocument} document
 * @param {Position} position
 * @returns {string}
 */
export function getCurrentSymbolsName(document: TextDocument, position: Position): string {
  const offset = document.offsetAt(position);
  const originalText = document.getText();
  const textBefore = originalText.slice(0, offset);
  const textAfter = originalText.slice(offset);
  const symbolBeforeCursorPart = textBefore.match(/[a-zA-Z0-9_-]+$/)?.[0] || "";
  const symbolAfterCursorPart = textAfter.match(/^[a-zA-Z0-9_-]+/)?.[0] || "";
  const symbolName = symbolBeforeCursorPart + symbolAfterCursorPart;

  return symbolName;
}
