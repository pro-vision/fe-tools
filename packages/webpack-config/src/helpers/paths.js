'use strict';

import { resolve } from 'path';
import { realpathSync } from 'fs';

import { defaultConfig } from '../webpack/default.configs';

const appDirectory = realpathSync(process.cwd());
export const resolveApp = relativePath => resolve(appDirectory, relativePath);

export const publicPath = process.env.PUBLIC_PATH || '';

export const appPath = resolveApp('.');
export const appSrc = resolveApp(defaultConfig.paths.src);
export const appTarget = resolveApp(defaultConfig.paths.target);