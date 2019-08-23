import { resolve } from 'path';

export const resolveSettings = {
  resolve : {
    // Add `.ts` as a resolvable extension.
    extensions: [".ts", ".js"],
    alias: {
      Core: resolve('src/js/core'),
      Services: resolve('src/js/services'),
      Helper: resolve('src/js/helper/'),
      Components: resolve('src/components/'),
      Abstacts: resolve('src/abstract-components/'),
      Icons: resolve('src/assets/icons'),
      Karma: resolve('src/js/karma')
    }
  }
};
