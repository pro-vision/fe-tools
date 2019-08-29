import { hbsPartialDir as options } from "../../../helpers/paths";

export const loadHandlebars = {
  module: {
    rules: [
      {
        test: /\.hbs/,
        use: [
          {
            loader: require.resolve("handlebars-loader"),
            options
          }
        ]
      }
    ]
  }
};
