import { join } from 'path';
import { appSrc, appName } from '../../../../helpers/paths';

export const moduleEntrySettings = {
  entry: {
    [appName]: [
      join(appSrc, 'js/index.ts'),
      join(appSrc, 'styles/main.scss'),
    ],
  }
};