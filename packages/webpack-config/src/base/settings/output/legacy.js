import { resolve } from 'path';

import { baseConfig } from '../../../base.config';

export const legacyOutputSettings = {
  output: {
    path: resolve(baseConfig.paths.target),
    filename: "js/[name].legacy.js",
    chunkFilename: 'js/chunks/[name].[hash].js',
  }
};
