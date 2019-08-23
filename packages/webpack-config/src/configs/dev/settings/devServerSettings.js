import { defaultConfig } from '../../default.configs';

export const devServerSettings = {
  devServer: {
    host: "0.0.0.0",
    contentBase: defaultConfig.paths.target,
    publicPath: "/",
    open: false,
    hot: true,
    port: defaultConfig.devServerPort,
    watchContentBase: true
  }
};