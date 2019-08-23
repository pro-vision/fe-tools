import { appTarget } from '../../../../helpers/paths';

export const moduleOutputSettings = {
  output: {
    path: appTarget,
    filename: "js/[name].js",
    chunkFilename: 'js/chunks/[name].[hash].js',
  }
};