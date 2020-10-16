const { appName, jsLegacyEntry } = require("../../../../helpers/paths");

module.exports = {
  entry: {
    [appName]: [jsLegacyEntry()]
  }
};
