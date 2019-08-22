export const compileLitHTML = {
  module: {
    rules: [
      {
        test: /lit-html/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              [
                require.resolve('@babel/preset-env'),
                {
                  targets: {
                    ie: 11,
                  },
                },
              ],
            ],
            plugins: [[require.resolve('@babel/plugin-transform-runtime')]],
          },
        },
      },
    ]
  }
};