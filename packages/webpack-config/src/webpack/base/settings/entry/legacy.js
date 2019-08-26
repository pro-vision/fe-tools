import { join } from 'path';
import { appSrc, appName } from '../../../../helpers/paths';

export const legacyEntrySettings = {
  entry: {
    [appName]: [
      join(appSrc, 'js/legacyIndex.ts')
    ],
  }
};