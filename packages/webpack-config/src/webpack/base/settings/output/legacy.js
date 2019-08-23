import { appTarget } from '../../../../helpers/paths';

export const legacyOutputSettings = {
  output: {
    path: appTarget,
    filename: "js/[name].legacy.js",
    chunkFilename: 'js/chunks/[name].[hash].js',
  }
};
