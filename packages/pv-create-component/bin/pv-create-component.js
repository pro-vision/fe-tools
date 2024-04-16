#!/usr/bin/env node

"use strict";
const { resolve: pathResolve } = require("path");
const { program, Option } = require("commander");
const { resolve } = require("path");
const chalk = require("chalk");
const figlet = require("figlet");

const { version } = require("../package.json");
const enquiry = require("./enquiry");
const generator = require("../lib");

const DEFAULT_UNIT_TYPE = "jest";
const DEFAULT_CREATE_COMPONENT_CONFIG = "scripts/create-component/config.js";

// read configuration from pv.config.js
const {
  namespace,
  // useTS is default true for pv webpack configs
  useTS = true,
  useReact = false,
} = getPvConfig();

program
  .version(version)
  .addOption(new Option("-N, --name [component name]", "component name, incase you don't want to answer it in the cli interaction").argParser(name => name.toLowerCase().trim()))
  .option("--skip [types...]", "list what files shouldn't be generated or question not asked. e.g. `--skip galen scss hbs data karma jest git`", [])
  .addOption(new Option('--unit [unitTestType]', "should `jest` (default) or `karma` (karma+jasmine) be used for Unit Tess").choices(["jest", "karma"]).default(DEFAULT_UNIT_TYPE))
  .option("--dontCheck", "ask to generate for example unit test files even if the user didn't want a js file")
  .option("--namespace [namespace]", "project namespace. Default the namespace from pv.config.js will be used", namespace)
  .option("-C, --config [config]", "relative path to the optional config file.", DEFAULT_CREATE_COMPONENT_CONFIG)
  .option("--templatesDir [templatesDir]", "relative path to the directory where default templates are overwritten. If non passed 'scripts/create-component/templates' will be checked")
  .option("--verbose", "logs debug information")
  .parse(process.argv);

// options provided by the user via CLI
const cliOptions = program.opts();

// bail out on react projects
if (useReact) {
  console.log(chalk.red("React projects are currently not supported by '@pro-vision/pv-create-component' script!"));
  process.exit(-1);
}

// get pv.config.js or if module is used outside the p!v FE project returns an empty object
function getPvConfig() {
  try {
    return require(resolve("./pv.config.js"));
  } catch (_error) {
    console.warn("Couldn't find ./pv.config.js");
  }
  return {}
}

function printIntroText() {

  console.log(
    chalk.yellow(
      figlet.textSync("Create Component", {
        horizontalLayout: "full"
      })
    )
  );

  console.log("You can enter a " + chalk.bold("name") + " for a new component. e.g. '" + chalk.green("Related Topics") + "',");
  console.log("you will be asked to choose hbs/scss or js file names.");
  console.log("All necessary files whit some boilerplate code and their imports will then be generated.");
  console.log("e.g.");
  console.log("template file: ", chalk.cyan(`${namespace}-m-related-topics.hbs`));
  if (useTS) {
    console.log("typescript file: ", chalk.cyan(`${namespace}-m-related-topics.ts`));
  }
  else {
    console.log("javascript file: ", chalk.cyan(`${namespace}-m-related-topics.js`));
  }

  console.log("\nyou can press any time ", chalk.bgWhite.black(" ctrl + c "), " to cancel the procedure.\n\n");

}

// returns user config with prompts and file generators will fallback to module config.js
function getConfig(configPath) {
  let config;

  try {
    config = require(pathResolve(configPath));
  }
  // user did not provide a custom config, use the default one
  catch (error) {
    // there was some error in the user's config file
    if (!error.message.startsWith("Cannot find module")) throw(error);
    config = require("../config");
  }

  return config;
}

async function run() {
  printIntroText();

  if (cliOptions.name) console.log(chalk.green("?"), "Component Name?", chalk.cyan(cliOptions.name));

  const config = getConfig(cliOptions.config);
  const prompts = config.map(item => item.prompt).filter(prompt => prompt !== undefined);

  const options = await enquiry(prompts, {
    useTS,
    ...cliOptions,
    // e.g. --skip galen -> `{hasGalen: false}` where `hasGalen` is the prompt name in the config.js
    ...Object.fromEntries(cliOptions.skip.map(type => [`has${type[0].toUpperCase()}${type.substring(1)}`, false]))
  });

  if (cliOptions.verbose) console.log("Filled in data: ", options);

  await generator(options, config, true);

  process.exit = 0;
}

run();
