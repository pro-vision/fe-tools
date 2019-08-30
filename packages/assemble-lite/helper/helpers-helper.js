'use strict';

const { resolve } = require('path');

const { getPaths, asyncReadFile } = require('./io-helper');

const handlebarsHelpers = require('handlebars-helpers');

const loadHelpers = async (helpersGlob, hbsInstance) => {
  
  hbsInstance.registerHelper(handlebarsHelpers());
  
  const helperPaths = await getPaths(helpersGlob);
  helperPaths.forEach(async (path) => {
    try {
      const helperFkt = require(resolve(path));
      hbsInstance.registerHelper(helperFkt);
    }
    catch(err) {
      console.log('err', err);
    }
  });
  return;
};

module.exports = {
  loadHelpers
};