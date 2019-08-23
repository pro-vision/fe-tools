import { baseConfig } from '../../base.config';

export const devServerSettings = {
  devServer: {
    host: "0.0.0.0",
    contentBase: baseConfig.paths.target,
    publicPath: "/",
    open: false,
    hot: true,
    port: baseConfig.feServerPort,
    watchContentBase: true
  }
};