import merge from 'webpack-merge';

// Base Config
import { baseConfigLegacy } from '../base/legacy';

// Settings
import { basicSettings } from './settings/basicSettings';
import { outputSettings } from './settings/outputSettings';
import { devServerSettings } from './settings/devServerSettings';

// Tasks
import { legacyCompileCSS } from './tasks/compileCSS/legacy';

export const devConfigLegacy = merge(
  baseConfigLegacy,
  basicSettings,
  outputSettings,
  devServerSettings,
  legacyCompileCSS,
);