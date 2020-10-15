const { asyncGlob } = require("@pro-vision/assemble-lite/helper/io-helper");

const { getAppConfig, join } = require("../helper/paths");

const { componentsSrc, cdPagesSrc, cdTemplatesSrc, lsgIndex } = getAppConfig();

const getFilesToWatch = async () => {
  const files = [lsgIndex];

  // add .md files
  files.push(...(await asyncGlob(join(componentsSrc, "**/*.md"))));

  // add .json Components files
  files.push(...(await asyncGlob(join(componentsSrc, "**/*.json"))));

  // add .yaml/.yml Component files
  files.push(...(await asyncGlob(join(componentsSrc, "**/*.yaml"))));
  files.push(...(await asyncGlob(join(componentsSrc, "**/*.yml"))));

  // add .hbs Components files
  files.push(...(await asyncGlob(join(componentsSrc, "**/*.hbs"))));

  // add .hbs Pages files
  files.push(...(await asyncGlob(join(cdPagesSrc, "**/*.hbs"))));

  // add .hbs Template files
  files.push(...(await asyncGlob(join(cdTemplatesSrc, "**/*.hbs"))));

  return files;
};

module.exports = {
  getFilesToWatch
};
