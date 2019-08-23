import { resolve } from 'path';
import { appPath } from '../../../../helpers/paths';

export const moduleEntrySettings = {
  entry: {
    "app": [
      resolve(appPath, "src/js/index.ts")
    ],
  }
};