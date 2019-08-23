import { resolve } from 'path';

import { baseConfig } from '../../../base.config';
import { appPath } from '../../../../helpers/paths';

export const legacyOutputSettings = {
  output: {
    path: resolve(appPath, baseConfig.paths.target),
    filename: "js/[name].legacy.js",
    chunkFilename: 'js/chunks/[name].[hash].js',
  }
};
