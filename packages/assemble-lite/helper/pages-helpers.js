'use strict';

const { basename, relative, dirname } = require('path');
const { loadFront } = require('yaml-front-matter');

const { asyncGlob, asyncReadFile, asyncWriteFile } = require('./io-helper');
const { applyTemplate } = require('./template-helper');


const assemblePages = async (options, hbsInstance) => {

  const {pagesGlob, templMap, target, data} = options;

  const pagesPaths = await asyncGlob(pagesGlob);
  
  return await Promise.all(pagesPaths.map(async (path) => {
    const filename = basename(path, '.hbs');
    const relpath = relative('src/components', path);
    const reldir = dirname(relpath);

    const markup = await asyncReadFile(path);

    const frontmatter = loadFront(markup);

    const curData = {...data, ...frontmatter};
    const pageMarkup = applyTemplate(templMap, curData.layout, frontmatter.__content);

    const result = assembleHbs(pageMarkup, curData, hbsInstance);
    await asyncWriteFile(target, reldir, filename, result);
  }));
};

const assembleHbs = (markup, data, hbsInstance) => {
  const hbs = hbsInstance.compile(markup);
  return hbs(data);
};

module.exports = {
  assemblePages,
}