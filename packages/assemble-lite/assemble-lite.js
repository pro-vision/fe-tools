const Handlebars = require('handlebars');

const { loadTemplates } = require('./helper/template-helper');
const { loadData } = require('./helper/data-helper');
const { loadPartials } = require('./helper/partials-helper');
const { assemblePages } = require('./helper/pages-helpers');

const defaultOptions = {
  baseDir: "./",
  partialsGlob: "",
  pagesGlob: "",
  templatesGlob: "",
  dataGlob: "",
  target: "",
};

const assemble = async (options) => {

  const { baseDir, partialsGlob, pagesGlob, templatesGlob, target, dataGlob } = { ...defaultOptions, ...options};

  const [templMap, data] = await Promise.all([
    loadTemplates(templatesGlob),
    loadData(dataGlob),
    loadPartials(partialsGlob, Handlebars)
  ]);
  
  await assemblePages({ baseDir ,pagesGlob, templMap, target, data}, Handlebars);

  return;
};


const baseDir = 'src';
const partialsGlob = 'src/components/**/*.hbs';
const pagesGlob = ['src/components/**/*.hbs', 'src/pages/**/*.hbs'];
const templatesGlob = 'src/templates/**/*.hbs';
const dataGlob = 'src/components/**/*.json';
const target = 'target';

assemble({ baseDir, partialsGlob, pagesGlob, templatesGlob, dataGlob, target })
  .catch(err => console.error('err', err));