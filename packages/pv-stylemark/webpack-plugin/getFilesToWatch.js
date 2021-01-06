const { asyncGlob } = require("@pro-vision/assemble-lite/helper/io-helper");

const { getAppConfig, join } = require("../helper/paths");

const {
  componentsSrc,
  cdPagesSrc,
  cdTemplatesSrc,
  lsgIndex,
  lsgAssetsSrc,
  hbsHelperSrc,
  lsgTemplatesSrc,
} = getAppConfig();

// glob pattern for the files used in the living styleguide
const fileGlobes = {
  staticStylemarkFiles: {
    index: lsgIndex,
    // stylemark .md files
    markDown: join(componentsSrc, "**/*.md"),
    // static assets / resources
    resources: join(lsgAssetsSrc, "**"),
  },
  assembleFiles: {
    data: [
      // add .json,.yaml/.yml Component data files
      join(componentsSrc, "**/*.{json,yaml,yml}"),
      // add .json,.yaml/.yml Layout data files
      join(cdTemplatesSrc, "**/*.{json,yaml,yml}"),
    ],
    // handlebars helpers
    helpers: join(hbsHelperSrc, "*.js"),
    // add .hbs Components files
    components: join(componentsSrc, "**/*.hbs"),
    // add .hbs Pages files
    pages: join(cdPagesSrc, "**/*.hbs"),
    // add .hbs Template/Layout files
    layouts: join(cdTemplatesSrc, "**/*.hbs"),
    // Living styleguide Layouts
    lsgLayouts: join(lsgTemplatesSrc, "**/*.hbs"),
  },
};

const getFilesToWatch = async () => {
  // get paths for assemble and lsg in parallel
  const lsgFilesPromise = Promise.all(
    Object.values(fileGlobes.staticStylemarkFiles).map(asyncGlob)
  );
  const assembleFilesPromise = Promise.all(
    Object.values(fileGlobes.assembleFiles).flat().map(asyncGlob)
  );
  const lsgFiles = (await lsgFilesPromise).flat();
  const assembleFiles = (await assembleFilesPromise).flat();

  return {
    lsgFiles,
    assembleFiles,
  };
};

module.exports = {
  fileGlobes,
  getFilesToWatch,
};
