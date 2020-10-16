const { jsEntry, cssEntry } = require("../../../../helpers/paths");
const {
  getAppName,
  shouldAddCssEntry
} = require("../../../../helpers/buildConfigHelpers");

const getEntries = () => {
  const entries = [jsEntry()];

  if (shouldAddCssEntry()) entries.push(cssEntry);

  return entries;
};

module.exports = {
  entry: {
    [getAppName()]: getEntries()
  }
};
