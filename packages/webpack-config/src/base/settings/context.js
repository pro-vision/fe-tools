import { resolve } from 'path';
import { baseConfig } from '../../base.config'

export const contextSettings = {
  context: resolve(baseConfig.paths.src),
};
