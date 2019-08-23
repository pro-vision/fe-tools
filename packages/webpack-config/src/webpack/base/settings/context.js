import { resolve } from 'path';
import { defaultConfig } from '../../default.configs'
import { appPath } from '../../../helpers/paths';

export const contextSettings = {
  context: resolve(appPath, defaultConfig.paths.src),
};
