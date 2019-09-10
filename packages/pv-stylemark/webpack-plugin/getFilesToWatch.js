const { asyncGlob } = require("@pro-vision/assemble-lite/helper/io-helper");

const { getAppConfig } = require("../helper/paths");

const {componentsHome, cdPagesHome, cdTemplatesHome, lsgIndex} = getAppConfig();

const getFilesToWatch = async () => {
  const files = [lsgIndex];

  // add .md files
  files.push(...await asyncGlob(`${componentsHome}**/*.md`));

  // add .json Components files
  files.push(...await asyncGlob(`${componentsHome}**/*.json`));

  // add .hbs Components files
  files.push(...await asyncGlob(`${componentsHome}**/*.hbs`));

  // add .hbs Pages files
  files.push(...await asyncGlob(`${cdPagesHome}**/*.hbs`));

  // add .hbs Template files
  files.push(...await asyncGlob(`${cdTemplatesHome}**/*.hbs`));

  return files;

};

module.exports = {
  getFilesToWatch
};