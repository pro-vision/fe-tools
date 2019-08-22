import { resolve } from 'path';

import { baseConfig } from '../../../base.config';
import { appPath } from '../../../helper/paths';

export const moduleOutputSettings = {
  output: {
    path: resolve(appPath, baseConfig.paths.target),
    filename: "js/[name].js",
    chunkFilename: 'js/chunks/[name].[hash].js',
  }
};