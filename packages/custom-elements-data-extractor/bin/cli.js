#!/usr/bin/env node
"use strict";

const path = require("path");
const { Command } = require("commander");
const CustomElementDataExtractor = require("../index.js");
const pkg = require("../package.json");

const program = new Command();
program.version(pkg.json);

program
  .option(
    "-i, --iconsDir <iconsDir>",
    "(optional) relative path to the directory containing svg icons. These icons will be provided as the options for the `icon-id` attribute. e.g. 'resources/icons'"
  )
  .option(
    "-o, --outDir [outDir]",
    "relative path to the directory were the generated HTML customData will be written to"
  )
  .requiredOption(
    "-c, --components <components>",
    "glob pattern to the directory containing the components. e.g 'src/components/**/*.ts'"
  )
  ;

program.parse(process.argv);
const options = program.opts();

async function run() {
  // read port and namespace from projects pv.config.js if it exists
  let pvConfig;
  try {
    pvConfig = require(path.resolve(process.cwd(), "pv.config.js"));
  } catch (_err) {
    // no pv.config.js
  }

  const extractor = new CustomElementDataExtractor({
    port: pvConfig ? pvConfig.devServerPort : undefined,
    namespace: pvConfig ? pvConfig.namespace : undefined,
    components: path.join(process.cwd(), options.components),
    iconsDir: options.iconsDir ? path.join(process.cwd(), options.iconsDir) : undefined,
  });

  await extractor.extractAllCustomElementsData();

  if (options.outDir) {
    const outDir = typeof options.outDir === "boolean" ? "." : options.outDir;
    await extractor.writeHTMLCustomData(path.join(process.cwd(), outDir));
  }

  process.exit(0);
}

run();
