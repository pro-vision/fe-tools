

const { basename, relative, dirname } = require("path");
const { loadFront } = require("yaml-front-matter");

const { getPaths, asyncReadFile, asyncWriteFile } = require("./io-helper");
const { applyTemplate } = require("./template-helper");

const assembleHbs = (markup, data, hbsInstance) => {
  const hbs = hbsInstance.compile(markup);
  return hbs(data);
};

const assemblePages = async (options, hbsInstance) => {

  const { baseDir, pages, templMap, target, data } = options;

  const pagesPaths = await getPaths(pages);


  return await Promise.all(pagesPaths.map(async path => {
    const filename = basename(path, ".hbs");
    const relpath = relative(baseDir, path);
    const reldir = dirname(relpath);

    const markup = await asyncReadFile(path);

    const frontmatter = loadFront(markup);

    const curData = {...data, ...frontmatter};
    const pageMarkup = applyTemplate(templMap, curData.layout, frontmatter.__content);

    const result = assembleHbs(pageMarkup, curData, hbsInstance);
    await asyncWriteFile(target, reldir, filename, result);
  }));
};

module.exports = {
  assemblePages,
};