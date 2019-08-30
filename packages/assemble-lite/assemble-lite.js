const Handlebars = require('handlebars');

const { loadTemplates } = require('./helper/template-helper');
const { loadData } = require('./helper/data-helper');
const { loadPartials } = require('./helper/partials-helper');
const { assemblePages } = require('./helper/pages-helper');
const { loadHelpers } = require('./helper/helpers-helper');

const defaultOptions = {
  baseDir: "./",
  partialsGlob: "",
  pagesGlob: "",
  templatesGlob: "",
  dataGlob: "",
  target: "",
};

const assemble = async (options) => {

  const { baseDir, partialsGlob, pagesGlob, templatesGlob, dataGlob, helpersGlob, target,  } = { ...defaultOptions, ...options};

  const [templMap, data] = await Promise.all([
    loadTemplates(templatesGlob),
    loadData(dataGlob),
    loadPartials(partialsGlob, Handlebars),
    loadHelpers(helpersGlob, Handlebars),
  ]);
  
  await assemblePages({ baseDir ,pagesGlob, templMap, target, data}, Handlebars);

  return;
};

module.exports = assemble;