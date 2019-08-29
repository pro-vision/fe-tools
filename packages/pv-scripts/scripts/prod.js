'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const chalk = require('chalk');
const webpack = require('webpack');
// const webpackMerge = require('webpack-merge');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printBuildError = require('react-dev-utils/printBuildError');
const { prepareWebpackConfig } = require('../helpers/prepareWebpackConfig');


prepareWebpackConfig('production')
  .then(webpackConfig => {    
    return webpackBuild(webpackConfig)
  })
  .then(
    ({ stats, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }
    },
    err => {
      console.log(chalk.red('Failed to compile.\n'));
      printBuildError(err);
      
      process.exit(1);
    }
  )
  .catch(err => {
    console.log('sss');
    
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });

// async function prepareWebpackConfig() {
//   const customWebpackConfig = await getCustomWebpackConfig('webpack.config.js');
//   const customWebpackProdConfig = await getCustomWebpackConfig('webpack.config.prod.js');

//   return getConfig('production').map(defaultConfig => webpackMerge(defaultConfig, customWebpackConfig, customWebpackProdConfig));
// }

// Create the production build
function webpackBuild(webpackConfig) {

  console.log('Creating an production build...');

  const compiler = webpack(webpackConfig);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }
        messages = formatWebpackMessages({
          errors: [err.message],
          warnings: [],
        });
      } else {
        messages = formatWebpackMessages(
          stats.toJson({ all: false, warnings: true, errors: true })
        );
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }

      return resolve({
        stats,
        warnings: messages.warnings,
      });
    });
  });
}