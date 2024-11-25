/// <reference path="../types.d.ts"/>
// @ts-check
"use strict";

const fs = require("fs");
const { resolve: pathResolve, dirname } = require("path");
const util = require("util");
const chalk = require("chalk");
const inquirer = require("inquirer");
const { simpleGit } = require("simple-git");
const mkdirp = require("mkdirp");


// for getting confirmation regarding overriding of existing files, ask user in cli
// shouldn't be used for example when files are generated by a project scaffolding scripts,
// or tests
let useInquirer = false;

let gitAdd = false;


/**
 * generates a file with the given content at the given path,
 * if the file already exist, the user will be asked to override or skip this file generation
 *
 * @param {string} filename - filename for the new file
 * @param {string} content - content of the new file
 * @async
 */
 async function generateFile(filename, content) {
  const path = pathResolve(filename);

  if (await fileExist(path)) {
    try {
      await getPermission(path);
    }
    // no permission --> don't modify file
    catch {
      return;
    }
  }
  try {
    await writeFile(path, content);
    if (gitAdd) {
      await simpleGit({ baseDir: process.cwd() }).add(path);
    }
    console.log(chalk.green("✓ " + path) + " was generated!");
  }
  catch (err) {
    console.log(chalk.red("X " + path), " file couldn't be created :( ", err);
  }
}

/**
 * generates a new file at the given path and with the given content
 *
 * @param {string} path - path for the the file
 * @param {string} content - content of the new file
 * @async
 */
 async function writeFile(path, content) {
  const asyncWriteFile = util.promisify(fs.writeFile);
  await mkdirp(dirname(path));
  await asyncWriteFile(path, content);
}

/**
 * changes the first letter of the given text to uppercase
 *
 * @param {string} name - name
 * @returns {string}
 */
function firstLetterToUpperCase(name) {
  return name.charAt(0).toUpperCase() + name.substring(1);
}

/**
 * changes the first letter of the given text to lowercase
 *
 * @param {string} name - name
 * @returns {string}
 */
function firstLetterToLowerCase(name) {
  return name.charAt(0).toLowerCase() + name.substring(1);
}

/**
 * add import statement to the given file
 *
 * @param {string} path - path of the file which should get the import statement added to
 * @param {string} importStatement - import state depending of the file type
 * @param {string} [placeholder] - if a placeholder is provided, the import will be added before the placeholder,
 *                                 otherwise at the end of file
 * @async
 */
 async function addImport(path, importStatement, placeholder) {

  const asyncReadFile = util.promisify(fs.readFile);

  try {
    let content = await asyncReadFile(path, "utf8");
    if (content.includes(importStatement)) {
      console.log(chalk.yellow("! ") + "import " + chalk.bgWhite.black(importStatement) + " was already added!");
      return;
    }
    // add before the placeholder
    if (placeholder) {
      content = content.replace(placeholder, `${importStatement}\n${placeholder}`);
    }
    // append to the file. ignore the last empty line.
    else {
      content = content.replace(/\n\n$/g, "\n") + `${importStatement}\n`;
    }

    await writeFile(path, content);
  }
  catch (err) {
    console.log(chalk.red("!") + " Couldn't read " + chalk.gray(path) + " to add import:");
    console.error(err);
  }
}

/**
 * checks if for the given file path a file exists
 *
 * @param {*} path - path of the file to check if exist
 * @returns {Promise<Boolean>}
 */
function fileExist(path) {
  return new Promise((resolve, _reject) => {
    fs.open(path, "r", (err, _fd) => {
      if (err) {
        resolve(false);
      }
      else {
        resolve(true);
      }
    });
  });
}

/**
 * if in interactive mode, the user will be asked in the cli if the file should be overridden
 * in non interactive mode, permission is always granted.
 *
 * @param {string} filename - name of the file which needs permission to be overridden
 * @returns {Promise<void>}
 */
function getPermission(filename) {
  if (!useInquirer) return Promise.resolve();

  return new Promise(async (resolve, reject) => {
    console.log(chalk.gray(filename) + " already " + chalk.red("exist") + ".");
    const answers = await inquirer.prompt([
      // override
      {
        type: "list",
        name: "override",
        message: "should it be overwritten?",
        choices: ["skip", "override"]
      }
    ]);

    if (answers.override === "override") {
      // permission to override file was granted
      resolve();
    }
    else {
      reject();
    }
  });
}

/**
 * generates boilerplate files for a new components according to the provided options
 *
 * @param {PvCreateComponent.Options} options - options for the creation of the new components necessary files
 * @param {PvCreateComponent.Config} config - configuration for files to be genared based on the options
 * @param {boolean} [isInteractive=false] - should the user be asked in the CLI when new information / permission is needed.
 *                                          Otherwise it assumes always the permission to be granted
 * @async
 */
module.exports = async function generateFiles(options, config = require("../config"), isInteractive = false) {

  useInquirer = Boolean(isInteractive);
  gitAdd = Boolean(options.gitAdd);

  const {
    namespace = "",
    name = "",
    type = "",
    hasTs = false,
    hasJs = false,
  } = options;

  // e.g. "related content" -> "Related Topics"
  const uppercase = name
    .split(" ")
    .map(firstLetterToUpperCase)
    .join(" ");
  // e.g. "RelatedTopics"
  const pascalCase = uppercase.replace(/ /g, "");
  // e.g. "relatedTopics"
  const camelCase = firstLetterToLowerCase(pascalCase);
  // e.g. "related-topics"
  const kebabCase = name.split(" ").join("-");
  // e.g. "PVRelatedTopics"
  const constructorName = namespace.toUpperCase() + pascalCase;

  // e.g. "related topics" -> "pv-m-related-topics"
  const componentName = `${namespace}-${type === "Element" ? "e-" : type === "Module" ? "m-" : ""}${kebabCase}`;

  /**
   * @type {PvCreateComponent.TemplateOptions}
   */
  const templateOptions = Object.assign({}, options, {
    uppercase,
    pascalCase,
    camelCase,
    kebabCase,
    constructorName,
    componentName,
    isCustomElement: Boolean(hasJs || hasTs),
  });

  for (const item of config) {
    // files
    if (item.files) {
      for (const file of item.files) {
        if ((typeof file.when === "function" && file.when(options)) || (typeof file.when === "boolean" && file.when)|| (typeof file.when === "undefined" && true)) {
          await generateFile(file.path(templateOptions), file.template(templateOptions));
        }
      }
    }

    // imports
    if (item.imports) {
      for (const imp of item.imports) {
        if ((typeof imp.when === "function" && imp.when(options)) || (typeof imp.when === "boolean" && imp.when)|| (typeof imp.when === "undefined" && true)) {
          const filePath = typeof imp.path === "function" ? imp.path(templateOptions) : imp.path;
          const placeholder = typeof imp.placeholder === "function" ? imp.placeholder(templateOptions) : imp.placeholder;
          await addImport(filePath, imp.template(templateOptions), placeholder);
        }
      }
    }
  }
};
