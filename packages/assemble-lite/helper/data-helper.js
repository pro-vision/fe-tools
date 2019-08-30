'use strict';

const { basename } = require('path');

const { asyncGlob } = require('./io-helper');
var { readJson } = require('fs-extra');

const loadData = async (dataGlob) => {
  const data = {};
  const dataPaths = await asyncGlob(dataGlob);
  await Promise.all(dataPaths.map(async (path) => {
      const filename = basename(path, '.json'); 
      const curData = await readJson(path);
      data[filename] = curData;
  }));
  return data;
};

module.exports = {
  loadData,
}