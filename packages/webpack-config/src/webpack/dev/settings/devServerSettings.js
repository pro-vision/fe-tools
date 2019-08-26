
import { getAppConfig } from '../../../helpers/paths';

export const devServerSettings = {
  devServer: {
    host: '0.0.0.0',
    contentBase: getAppConfig().destPath,
    publicPath: '/',
    open: false,
    hot: true,
    quiet: true,
    clientLogLevel: 'none',
    port: getAppConfig().devServerPort,
    watchContentBase: true
  }
};