const {
  appName,
  jsEntry,
  cssEntry,
  addCssEntry
} = require("../../../../helpers/paths");

const getEntries = () => {
  const entries = [jsEntry()];

  if (addCssEntry()) entries.push(cssEntry);

  return entries;
};

module.exports = {
  entry: {
    [appName]: getEntries()
  }
};
