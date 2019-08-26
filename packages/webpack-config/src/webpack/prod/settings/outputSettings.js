import { publicPath } from '../../../helpers/paths';

export const outputSettings = {
  output: {
    publicPath: publicPath,
    chunkFilename: 'chunks/[name].[hash].js',
  }
};