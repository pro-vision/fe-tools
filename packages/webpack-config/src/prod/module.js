import merge from 'webpack-merge';

// Base Config
import { baseConfigModule } from '../base/module';

// Settings
import { basicSettings } from './settings/basicSettings';

// Tasks
import { compileCSS } from './tasks/compileCSS'
import { outputSettings } from './settings/outputSettings';

export const prodConfigModule = merge(
  baseConfigModule,
  basicSettings,
  outputSettings,
  compileCSS,
);