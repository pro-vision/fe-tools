import { resolve } from 'path';

import { baseConfig } from '../../../base.config';

export const moduleOutputSettings = {
  output: {
    path: resolve(baseConfig.paths.target),
    filename: "js/[name].js",
    chunkFilename: 'js/chunks/[name].[hash].js',
  }
};