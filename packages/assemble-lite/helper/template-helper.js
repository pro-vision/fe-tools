const { basename } = require("path");

const { getPaths, asyncReadFile } = require("./io-helper");

const loadTemplates = async (templates) => {
  const templatePaths = await getPaths(templates);
  const templMap = new Map();
  await Promise.all(
    templatePaths.map(async (path) => {
      const filename = basename(path, ".hbs");
      const markup = await asyncReadFile(path);

      templMap.set(filename, markup);
    })
  );
  return templMap;
};

const applyTemplate = (templMap, templateName, page) => {
  if (!templMap.has(templateName)) return page;

  const template = templMap.get(templateName);
  return template.replace(/{%\s*body\s*%}/g, page);
};

module.exports = {
  loadTemplates,
  applyTemplate,
};
