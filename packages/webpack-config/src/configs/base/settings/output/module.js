import { resolve } from 'path';

import { defaultConfig } from '../../../default.configs';
import { appPath } from '../../../../helpers/paths';

export const moduleOutputSettings = {
  output: {
    path: resolve(appPath, defaultConfig.paths.target),
    filename: "js/[name].js",
    chunkFilename: 'js/chunks/[name].[hash].js',
  }
};