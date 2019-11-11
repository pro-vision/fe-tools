"use strict";

const inquirer = require("inquirer");

const DATA_FILE_TYPES = {JSON: ".json", YAML: ".yaml"};

/**
 * asks the user information regarding the necessary files for the new component
 *
 * @param {Object} options - enquiry options
 * @param {string} [options.name] - pre-filled component name. e.g. "related teasers"
 * @param {boolean} [options.useTS = false] - use typescript instead of js
 * @param {boolean} [options.dontCheck = false] - ask to generate for example unit test files even if the user didn't want a js file
 *                                               this is helpful if some files needs to be generated later
 * @returns {Promise<Object>} - info which user has filled in.
 */
module.exports = async function enquiry ({name: defaultName, useTS = false, dontCheck = false} = {}) {
  const answers = await inquirer.prompt([
    // Component Name
    {
      type: "input",
      message: "What's the component's name?:",
      name: "name",
      validate (value) {
        // only letters and numbers. (no special characters such as '-' and '_')
        const pass = value.match(/(^[a-zA-Z0-9 ]+$)/g);
        if (pass) {
          return true;
        }

        return "Please enter only letters, numbers and spaces";
      },
      filter (name) {
        // " Related Topics " -> "related topics"
        return name
          .trim()
          .toLowerCase()
          // only one empty space between between letters is allowed
          .replace(/ ( )+/g, " ");
      },
      // if name was provided via cli invocation, use it as default
      ...(defaultName ? {"default": defaultName} : null)
    },
    // type
    {
      type: "list",
      name: "type",
      message: "Type?",
      choices: ["Element", "Module", "Page"]
    },
    //  has css
    {
      when: currentAnswers => currentAnswers.type !== "Page",
      type: "confirm",
      message: "Has scss?",
      "default": true,
      name: "hasScss",
    },
    //  has html
    {
      when: currentAnswers => currentAnswers.type !== "Page",
      type: "confirm",
      message: "Has hbs?",
      "default": true,
      name: "hasHbs",
    },
    // type
    {
      when: currentAnswers => currentAnswers.hasHbs,
      type: "list",
      name: "dataFile",
      message: "Use Data File?",
      choices: ["don't", DATA_FILE_TYPES.JSON, DATA_FILE_TYPES.YAML],
      filter (dataFile) {
        if (dataFile === DATA_FILE_TYPES.JSON || dataFile === DATA_FILE_TYPES.YAML) return dataFile;

        return false;
      }
    },
    //  has js/ts
    {
      when: currentAnswers => currentAnswers.type !== "Page",
      type: "confirm",
      message: `Has ${useTS ? "ts" : "js"}?`,
      "default": true,
      name: `${useTS ? "hasTs" : "hasJs"}`,
    },
    //  has unit
    {
      when: dontCheck || (currentAnswers => currentAnswers.hasJs || currentAnswers.hasTs),
      type: "confirm",
      message: "Add Unit test?",
      "default": true,
      name: "hasUnit",
    },
    //  has Galen
    {
      when: currentAnswers => currentAnswers.type !== "Page" && (currentAnswers.hasScss || dontCheck),
      type: "confirm",
      message: "Add Galen test?",
      "default": true,
      name: "hasGalen",
    },
    //  git add
    {
      type: "confirm",
      message: "track new files via git? (git add)",
      "default": true,
      name: "gitAdd"
    }
  ]);

  return answers;
};

// expose the assemble data file types enum
module.exports.DATA_FILE_TYPES = DATA_FILE_TYPES;
