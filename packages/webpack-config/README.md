# webpack-config

Default WebpackConfig - Generator for development and prod config. Includes all loaders for SCSS, JS, TS, JSX, TSX bundling and transpiling.

## Installation

```sh
npm i @pro-vision/webpack-config
```


## Usage:

```js
// my.webpack.prod.config.js
const { getConfig } = require('@pro-vision/webpack-config');
const webpackConfig = getConfig('production');

module.exports = webpackConfig;
```