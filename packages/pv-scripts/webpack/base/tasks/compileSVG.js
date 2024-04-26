const svgoLoader = {
  loader: require.resolve("svgo-loader"),
  options: {
    configFile: false,
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      },
      "prefixIds", // prefix generated IDs with file name to make them unique across SVGs
    ],
  },
};

module.exports = {
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.svg$/,
            /**
             * resource will be emitted to target folder and its url added to the import
             * @example
             *   import svgUrl from("./icon.svg?resource");
             *   fetch(svgUrl);
             */
            resourceQuery: /resource|external/,
            type: "asset/resource",
            use: [svgoLoader],
          },
          {
            test: /\.svg$/,
            /**
             * svg content will be base64 encoded an used inline:
             * @example
             *   background-image: url("./img.svg?inline"); // => background-image: url(data:image/svg+xml;base64,PHN...
             */
            resourceQuery: /inline/,
            type: "asset/inline",
            use: [svgoLoader],
          },
          {
            test: /\.svg$/,
            /**
             * "... webpack will automatically choose between resource and inline by following a default condition: a file with size less than 8kb will be treated as a inline module type and resource module type otherwise."
             * @link https://webpack.js.org/guides/asset-modules/
             * @example
             *   background: url("./icon.svg?auto")
             */
            resourceQuery: /auto/,

            type: "asset",
            use: [svgoLoader],
          },
          {
            test: /\.svg$/,
            /**
             * the svg files content will be used
             * @example
             *   import svgContent from("./icon.svg?raw");
             *   el.innerHTML = svgContent;
             */
            resourceQuery: /source|raw/,
            type: "asset/source",
            use: [svgoLoader],
          },
          {
            test: /\.svg$/,
            // for svg imported in the css, default use only the url and let css load it on the client.
            // inlining would otherwise balloon the css file size. but if needed can be forced via the `?inline` query.
            issuer: /\.css|scss$/,
            type: "asset/resource",
            use: [svgoLoader],
          },
          {
            test: /\.svg$/,
            // default use the content of the svg, for example when imported from .ts file.
            type: "asset/source",
            use: [svgoLoader],
          },
        ],
      },
    ],
  },
};
