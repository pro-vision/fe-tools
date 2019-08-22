import { resolve } from 'path';
import { appPath } from '../../../helper/paths';

export const legacyEntrySettings = {
  entry: {
    "app": [
      resolve(appPath, "src/js/legacyIndex.ts")
    ],
  }
};