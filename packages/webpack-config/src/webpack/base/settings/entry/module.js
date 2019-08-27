
import { appName, jsEntry, cssEntry } from '../../../../helpers/paths';

export const moduleEntrySettings = {
  entry: {
    [appName]: [
      jsEntry,
      cssEntry,
    ],
  }
};