import { defaultConfig } from '../../default.configs';

export const devServerSettings = {
  devServer: {
    host: "0.0.0.0",
    contentBase: defaultConfig.paths.target,
    publicPath: "/",
    open: false,
    hot: true,
    quiet: true,
    clientLogLevel: 'none',
    port: defaultConfig.devServerPort,
    watchContentBase: true
  }
};