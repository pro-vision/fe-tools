import merge from 'webpack-merge';

// Base Config
import { defaultConfigLegacy } from '../base/legacy';

// Settings
import { basicSettings } from './settings/basicSettings';

// Tasks
import { compileCSS } from './tasks/compileCSS'
import { outputSettings } from './settings/outputSettings';

export const prodConfigLegacy = merge(
  defaultConfigLegacy,
  basicSettings,
  outputSettings,
  compileCSS,
);