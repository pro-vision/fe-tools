module.exports = {
  module: {
    rules: [
      {
        test: /\.shadow\.scss$/,
        type: "asset/source",
        use: [
          {
            loader: require.resolve("sass-loader"),
          },
        ],
      },
    ],
  },
};
