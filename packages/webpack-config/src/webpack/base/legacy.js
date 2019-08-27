import merge from 'webpack-merge';

// Settings
import { legacyEntrySettings } from './settings/entry/legacy';
import { legacyOutputSettings } from './settings/output/legacy';
import { contextSettings } from './settings/context';
import { resolveSettings } from './settings/resolve';

// Tasks
import { legacyCompileTS } from './tasks/compileTS/legacy'
import { compileLitHTML } from './tasks/compileLitHTML'
import { loadFonts } from './tasks/loadFonts'
import { compileShadowCSS } from './tasks/compileShadowCSS';
import { loadHandlebars } from './tasks/loadHandlebars';

export const defaultConfigLegacy = merge(
  legacyEntrySettings,
  legacyOutputSettings,
  contextSettings,
  resolveSettings,
  legacyCompileTS,
  compileLitHTML,
  compileShadowCSS,
  loadFonts,
  loadHandlebars,
);