const { asyncGlob } = require("@pro-vision/assemble-lite/helper/io-helper");

const { getAppConfig, join } = require("../helper/paths");

const {
  componentsSrc,
  cdPagesSrc,
  cdTemplatesSrc,
  lsgIndex,
  lsgAssetsSrc,
  hbsHelperSrc
} = getAppConfig();

const getFilesToWatch = async () => {
  const files = [lsgIndex];

  // stylemark .md files
  files.push(...(await asyncGlob(join(componentsSrc, "**/*.md"))));
  // assets
  files.push(...(await asyncGlob(join(lsgAssetsSrc, "**"))));

  // add .json Components files
  files.push(...(await asyncGlob(join(componentsSrc, "**/*.json"))));

  // add .yaml/.yml Component files
  files.push(...(await asyncGlob(join(componentsSrc, "**/*.yaml"))));
  files.push(...(await asyncGlob(join(componentsSrc, "**/*.yml"))));

  // handlebars helpers
  files.push(...(await asyncGlob(join(hbsHelperSrc, "*.js"))));

  // add .hbs Components files
  files.push(...(await asyncGlob(join(componentsSrc, "**/*.hbs"))));

  // add .hbs Pages files
  files.push(...(await asyncGlob(join(cdPagesSrc, "**/*.hbs"))));

  // add .hbs Template files
  files.push(...(await asyncGlob(join(cdTemplatesSrc, "**/*.hbs"))));

  return files;
};

module.exports = {
  getFilesToWatch,
};
