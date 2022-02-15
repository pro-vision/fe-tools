const { join } = require("../../../helpers/paths");
const { getBuildConfig } = require("../../../helpers/buildConfigHelpers");

const { fontsSrc } = getBuildConfig();

module.exports = {
  module: {
    rules: [
      {
        test: /\.(woff|otf|eot|ttf)([?]?.*)$/,
        type: "asset/resource",
        generator: {
          filename: join(fontsSrc, "[base]"),
        },
      },
    ],
  },
};
