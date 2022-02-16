module.exports = function (appConfig) {
  return `const path = require("path");
const mockerAPI = require("mocker-api");
${
  appConfig.useLSG === false
    ? ""
    : `const { PvStylemarkPlugin } = require("@pro-vision/pv-stylemark");`
}

module.exports = {
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      middlewares.push(
        mockerAPI(devServer.app, path.resolve("./config/mocker-api/config.js"), {
          changeHost: true,
          header: {
            'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With, Authorization, metadata, Ocp-Apim-Subscription-Key',
          }
        })
      );
      return middlewares;
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  ${
    appConfig.useLSG === false
      ? ""
      : `plugins: [
    new PvStylemarkPlugin()
  ],`
  }
};  
`;
};
