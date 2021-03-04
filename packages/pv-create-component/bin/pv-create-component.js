#!/usr/bin/env node
"use strict";
const { program, Option } = require("commander");
const { resolve } = require("path");
const chalk = require("chalk");
const figlet = require("figlet");

const { version } = require("../package.json");
const enquiry = require("./enquiry");
const generator = require("../lib");

program
  .version(version)
  .option("-N, --name [component name]", "component name, incase you don't want to answer it in the cli interaction", "")
  .option("-Y, --yes", "answer all questions automatically with 'YES'")
  .option("--skip [types...]", "list what files shouldn't be generated or question not asked. e.g. `--skip galen scss hbs data karma jest git`", [])
  .addOption(new Option('--unit [unitTestType]', "should `jest` (default) or `karma` (karma+jasmine) be used for Unit Tess").choices(["jest", "karma"]).default("jest"))
  .option("--dontCheck", "ask to generate for example unit test files even if the user didn't want a js file")
  .option("--verbose", "logs debug information")
  .parse(process.argv);

// options provided by the user via CLI
const cliOptions = program.opts();

// read configuration from pv.config.js
const {
  namespace,
  // useTS is default true for pv webpack configs
  useTS = true,
  useReact = false,
} = require(resolve("./pv.config.js"));


// bail out on react projects
if (useReact) {
  console.log(chalk.red("React projects are currently not supported by 'create-new-component' script!"));
  process.exit(-1);
}

// warn regarding missing feature
if (cliOptions.yes) {
  console.log(chalk.orange("The 'YES' option is not implemented yet. Please open a github issue!"));
}

run();


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
  console.log("i.e.");
  console.log("template file: ", chalk.cyan(`${namespace}-m-related-topics.hbs`));
  if (useTS) {
    console.log("typescript file: ", chalk.cyan(`${namespace}-m-related-topics.ts`));
  }
  else {
    console.log("javascript file: ", chalk.cyan(`${namespace}-m-related-topics.js`));
  }

  console.log("\nyou can press any time ", chalk.bgWhite.black(" ctrl + c "), " to cancel the procedure.\n\n");

}

async function run() {
  printIntroText();

  const options = await enquiry({
    useTS,
    // e.g. "related topic"
    name: cliOptions.name.toLowerCase(),
    dontCheck: cliOptions.dontCheck,
    skip: cliOptions.skip,
    unitType: cliOptions.unit,
  });

  if (cliOptions.verbose) console.log("Filled in data: ", options);

  await generator({
    ...options,
    isInteractive: true,
    unitType: cliOptions.unit,
    namespace,
  });

  process.exit = 0;
}
