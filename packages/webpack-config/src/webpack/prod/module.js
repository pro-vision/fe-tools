import merge from 'webpack-merge';

// Base Config
import { defaultConfigModule } from '../base/module';

// Settings
import { basicSettings } from './settings/basicSettings';

// Tasks
import { compileCSS } from './tasks/compileCSS';

export const prodConfigModule = merge(
  defaultConfigModule,
  basicSettings,
  compileCSS,
);