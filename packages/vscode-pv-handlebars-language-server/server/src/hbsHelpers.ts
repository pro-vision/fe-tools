import { getCustomHelperFiles } from "./helpers";

// eslint-disable-next-line
const handlebarsHelpers: Record<string, Record<string, Function>> = require("handlebars-helpers/lib/index.js");
// eslint-disable-next-line
const pvHandlebarsHelpers: Record<string, Function> = require("@pro-vision/handlebars-helpers");

// Handlebars build in helpers (@see https://handlebarsjs.com/guide/builtin-helpers.html)
export const BUILD_IN_HELPERS = ["if", "unless", "each", "with", "lookup", "log"];

// list of Handlebars helpers from https://github.com/helpers/handlebars-helpers
export const handlebarsHelpersNames = Object.values(handlebarsHelpers)
  .map(group => Object.keys(group))
  .flat();

// list of Handlebars helpers from https://github.com/pro-vision/fe-tools/tree/master/packages/handlebars-helpers
export const pvHandlebarsHelperNames = Object.keys(pvHandlebarsHelpers);

// list of Handlebars helpers in the provided folder which assemble-lite would use
export async function getCustomHelpers(componentsRootPath: string): Promise<Array<{ path: string; name: string }>> {
  return getCustomHelperFiles(componentsRootPath);
}

// return the handlebars names for build in helpers, handlebars-helpers and @pro-vision handlebars helpers and custom helpers in the workspace
export async function getAllHelperNames(componentsRootPath: string): Promise<string[]> {
  const customHelpers = (await getCustomHelpers(componentsRootPath)).map(helper => helper.name);

  return [...BUILD_IN_HELPERS, ...handlebarsHelpersNames, ...pvHandlebarsHelperNames, ...customHelpers];
}
