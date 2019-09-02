
import { appName, jsEntry, cssEntry, addCssEntry } from "../../../../helpers/paths";

const getEntries = () => {
  const entries = [
    jsEntry
  ];

  if (addCssEntry()) entries.push(cssEntry);

  return entries;
};

export const moduleEntrySettings = {
  entry: {
    [appName]: getEntries(),
  }
};