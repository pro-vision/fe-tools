/// <reference path="../types.d.ts"/>
"use strict";

const inquirer = require("inquirer");

/**
 * asks the user information regarding the necessary files for the new component
 *
 * @param {PvCreateComponent.CliOptions} cliOptions - enquiry options
 * @returns {Promise<Object>} - info which user has filled in.
 */
module.exports = async function enquiry (prompts, cliOptions = {}) {
  const answers = await inquirer.prompt(prompts, cliOptions);

  return answers;
};
