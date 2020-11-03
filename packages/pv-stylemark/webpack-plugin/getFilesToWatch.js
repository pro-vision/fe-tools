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
  const files = {

    staticStylemarkFiles: [
      lsgIndex,
      // stylemark .md files
      ...(await asyncGlob(join(componentsSrc, "**/*.md"))),
      // static assets / resources
      ...(await asyncGlob(join(lsgAssetsSrc, "**")))
    ],

    assembleFiles: [
      // add .json Components files
      ...(await asyncGlob(join(componentsSrc, "**/*.json"))),
      // add .yaml/.yml Component files
      ...(await asyncGlob(join(componentsSrc, "**/*.yaml"))),
      ...(await asyncGlob(join(componentsSrc, "**/*.yml"))),
      // handlebars helpers
      ...(await asyncGlob(join(hbsHelperSrc, "*.js"))),
      // add .hbs Components files
      ...(await asyncGlob(join(componentsSrc, "**/*.hbs"))),
      // add .hbs Pages files
      ...(await asyncGlob(join(cdPagesSrc, "**/*.hbs"))),
      // add .hbs Template files
      ...(await asyncGlob(join(cdTemplatesSrc, "**/*.hbs")))
    ]
  };

  return files;
};

module.exports = {
  getFilesToWatch,
};
