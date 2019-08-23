import { join } from 'path';
import { appSrc } from '../../../../helpers/paths';

export const moduleEntrySettings = {
  entry: {
    "app": [
      join(appSrc, 'js/index.ts'),
      join(appSrc, 'styles/main.scss'),
    ],
  }
};