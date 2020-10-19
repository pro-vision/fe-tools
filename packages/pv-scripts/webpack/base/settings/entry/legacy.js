const { jsLegacyEntry } = require("../../../../helpers/paths");
const { getAppName } = require("../../../../helpers/buildConfigHelpers");

module.exports = {
  entry: {
    [getAppName()]: [jsLegacyEntry()],
  },
};
