import { resolve } from 'path';
import { defaultConfig } from '../../default.configs'

export const contextSettings = {
  context: resolve(defaultConfig.paths.src),
};
