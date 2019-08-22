#!/usr/bin/env node

const getConfig = require('@pro-vision/webpack-config');
const webpack = require('webpack');
const webpackConfig = getConfig('production');

const compiler = webpack(webpackConfig);
compiler.run((err, stats) => {
  console.log('err', err);
  console.log('st', stats);
});