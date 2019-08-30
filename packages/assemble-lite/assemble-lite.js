const Handlebars = require('handlebars');

const { loadTemplates } = require('./lib/template-helper');
const { loadData } = require('./lib/data-helper');
const { loadPartials } = require('./lib/partials-helper');
const { assemblePages } = require('./lib/pages-helpers');

const assemble = async (partialsGlob, pagesGlob, templatesGlob, dataGlob, target) => {
  const [templMap, data] = await Promise.all([
    loadTemplates(templatesGlob),
    loadData(dataGlob),
    loadPartials(partialsGlob, Handlebars)
  ]);
  
  await assemblePages({pagesGlob, templMap, target, data}, Handlebars);

  return;
};

const partialsGlob = 'src/components/**/*.hbs';
const pagesGlob = 'src/components/**/*.hbs';
const templatesGlob = 'src/templates/**/*.hbs';
const dataGlob = 'src/components/**/*.json';
const target = 'target/components';

assemble(partialsGlob, pagesGlob, templatesGlob, dataGlob, target)
  .catch(err => console.error('err', err));