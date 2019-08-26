import { publicPath } from '../../../helpers/paths';

export const outputSettings = {
  output: {
    publicPath: publicPath,
    chunkFilename: 'js/chunks/[name].[hash].js',
  }
};
