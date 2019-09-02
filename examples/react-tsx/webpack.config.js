const { resolve } = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  plugins: [
    new CopyWebpackPlugin([
      { from: resolve('static'), to: '.' }
    ])
  ]
}