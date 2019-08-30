'use strict';

var glob = require('glob');
var fs = require('fs-extra');

const asyncGlob = (globPattern) => {
  return new Promise((resolve, reject) => {
    glob(globPattern, {}, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(files);
    });
  });
}

const asyncReadFile = (filePath) => {
  return fs.readFile(filePath, 'utf8');
};

const asyncWriteFile = async (target, reldir, filename, markup) => {
  await fs.ensureDir(`${target}/${reldir}`);
  return fs.writeFile(`${target}/${reldir}/${filename}.html`, markup, 'utf8');
}

module.exports = {
  asyncGlob,
  asyncReadFile,
  asyncWriteFile
};