import { resolve } from 'path';

export const legacyEntrySettings = {
  entry: {
    "app": [
      resolve("src/js/legacyIndex.ts")
    ],
  }
};