const Handlebars = require("handlebars");

const { loadTemplates } = require("./helper/template-helper");
const { loadData } = require("./helper/data-helper");
const { loadPartials } = require("./helper/partials-helper");
const { assemblePages } = require("./helper/pages-helper");
const { loadHelpers } = require("./helper/helpers-helper");

const defaultOptions = {
  baseDir: "./",
  partials: "",
  pages: "",
  templates: "",
  data: "",
  target: "",
};

const assemble = async (options) => {
  const { baseDir, partials, pages, templates, data, helpers, target } = {
    ...defaultOptions,
    ...options,
  };

  const [templMap, dataPool] = await Promise.all([
    loadTemplates(templates),
    loadData(data),
    loadPartials(partials, Handlebars),
    loadHelpers(helpers, Handlebars),
  ]);

  await assemblePages(
    { baseDir, pages, templMap, target, dataPool },
    Handlebars
  );

  return;
};

module.exports = assemble;
