import { join } from 'path';
import { appSrc } from '../../../../helpers/paths';

export const legacyEntrySettings = {
  entry: {
    'app': [
      join(appSrc, 'js/legacyIndex.ts')
    ],
  }
};