const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { shouldAddContentHash } = require("../../../helpers/buildConfigHelpers");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: require.resolve("css-loader"),
      },
      {
        test: /\.scss$/,
        exclude: /\.shadow\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: require.resolve("css-loader"),
            options: {
              sourceMap: true,
            },
          },
          {
            loader: require.resolve("postcss-loader"),
            options: {
              implementation: require("postcss"),
              sourceMap: true,
              postcssOptions: {
                plugins: [
                  [
                    require.resolve("postcss-preset-env"),
                    {
                      features: {},
                    },
                  ],
                  [
                    require.resolve("cssnano"),
                    {
                      preset: [
                        "default",
                        {
                          // Prevent conversion of colors to smallest representation, to avoid problems
                          // when converting `rgba(255, 255, 255, opacity)` to `hsla(0,0%,100%, opacity)`.
                          // The compressor in AEM strips the `%` from the `0%` saturation value,
                          // resulting in an invalid property value.
                          colormin: false,
                        },
                      ],
                    },
                  ],
                ],
              },
            },
          },
          {
            loader: require.resolve("sass-loader"),
            options: {
              sourceMap: true,
              ...getSassImpelemntation(),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: shouldAddContentHash()
        ? "css/[name].[contenthash].css"
        : "css/[name].css",
    }),
  ],
};

// returns what node implementation the user has instaled,
// this allows them to override the pv-scripts dependecy which will act as the default one.
function getSassImpelemntation() {
  const sassImplementationOptions = [
    { pkg: "sass-embedded", api: "modern-compiler" }, // fastest
    { pkg: "node-sass", api: "legacy" }, // legacy
    { pkg: "sass", api: "modern" }, // default dependecy of pv-scripts
  ];

  for (const { pkg, api } of sassImplementationOptions) {
    try {
      require.resolve(pkg);
      return {
        implementation: require(pkg),
        api,
      };
    } catch {}
  }

  return {};
}
