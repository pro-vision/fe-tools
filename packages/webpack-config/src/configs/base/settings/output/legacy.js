import { resolve } from 'path';

import { defaultConfig } from '../../../default.configs';
import { appPath } from '../../../../helpers/paths';

export const legacyOutputSettings = {
  output: {
    path: resolve(appPath, defaultConfig.paths.target),
    filename: "js/[name].legacy.js",
    chunkFilename: 'js/chunks/[name].[hash].js',
  }
};
