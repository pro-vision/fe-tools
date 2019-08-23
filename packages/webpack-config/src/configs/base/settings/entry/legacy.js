import { resolve } from 'path';
import { appPath } from '../../../../helpers/paths';

export const legacyEntrySettings = {
  entry: {
    "app": [
      resolve(appPath, "src/js/legacyIndex.ts")
    ],
  }
};