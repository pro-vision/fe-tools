const { basename } = require("path");
const { loadFront } = require("yaml-front-matter");

const { getPaths, asyncReadFile } = require("./io-helper");

const loadPartials = async (partials, hbsInstance) => {
  const partialPaths = await getPaths(partials);

  return await Promise.all(
    partialPaths.map(async (path) => {
      const filename = basename(path, ".hbs");
      const markup = await asyncReadFile(path);
      const { clearedMarkup } = loadFront(markup, {
        contentKeyName: "clearedMarkup",
      });
      hbsInstance.registerPartial(filename, clearedMarkup);
    })
  );
};

module.exports = {
  loadPartials,
};
