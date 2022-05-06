# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.1.4](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-scripts@4.1.3...@pro-vision/pv-scripts@4.1.4) (2022-05-06)

**Note:** Version bump only for package @pro-vision/pv-scripts





## [4.1.3](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-scripts@4.1.2...@pro-vision/pv-scripts@4.1.3) (2022-05-06)


### Bug Fixes

* **pv-scripts:** fix the relative path to the default browserslistrc file ([39b00cc](https://github.com/pro-vision/fe-tools/commit/39b00cc704629bd6cc47f44d75fd39d8cadd77be))





## [4.1.2](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-scripts@4.1.1...@pro-vision/pv-scripts@4.1.2) (2022-02-02)


### Bug Fixes

* **pv-scripts:** fixed babel-plugin-proposal-decorators runtime issue ([c110ce1](https://github.com/pro-vision/fe-tools/commit/c110ce136d729e2536d8bce6df5451489eba8d9f))





## [4.1.1](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-scripts@4.1.0...@pro-vision/pv-scripts@4.1.1) (2022-01-19)

**Note:** Version bump only for package @pro-vision/pv-scripts





# [4.1.0](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-scripts@4.0.4...@pro-vision/pv-scripts@4.1.0) (2021-11-15)


### Bug Fixes

* **pv-scripts:** add postcss as direct dependency ([8c242fa](https://github.com/pro-vision/fe-tools/commit/8c242fa9ef41947ea537d349508e395e0cb9bff7))
* **pv-scripts:** ignore warning on missing source map in dependencies ([296fae9](https://github.com/pro-vision/fe-tools/commit/296fae93ff92ccffef2ae4c5b7a7c99d5831e937))
* **pv-scripts:** ignore warning on missing source map in dependencies ([ec43135](https://github.com/pro-vision/fe-tools/commit/ec43135505487a8253533212f1348dfcf8c2ee84))


### Features

* **pv-scripts:** add basic loader for css files to support external css dependencies ([af0de92](https://github.com/pro-vision/fe-tools/commit/af0de92accabdf612b07e085bfed050a6e409e01))
* **pv-scripts:** add config flag to enable content hashs for js and css files ([298efcb](https://github.com/pro-vision/fe-tools/commit/298efcb458b6825625cd0b019fc219ed41f867ff))
* **pv-scripts:** add config flag to enable content hashs for js and css files ([e871191](https://github.com/pro-vision/fe-tools/commit/e871191a10f44b9a70140e53594a9cbd3959050c))





## [4.0.4](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-scripts@4.0.3...@pro-vision/pv-scripts@4.0.4) (2021-09-15)


### Bug Fixes

* **pv-scripts:** fixed reloading issue where browser freezed when changing a hbs file ([8bd6552](https://github.com/pro-vision/fe-tools/commit/8bd6552a2b1a935494e4bfd4488b41da065b0608))





## [4.0.3](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-scripts@4.0.2...@pro-vision/pv-scripts@4.0.3) (2021-09-15)


### Bug Fixes

* **pv-scripts:** fix port blocked issue by using stopCallback ([48d2479](https://github.com/pro-vision/fe-tools/commit/48d2479ddd9ac61a7886710e47f7302c568c9e64))





## [4.0.2](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-scripts@4.0.1...@pro-vision/pv-scripts@4.0.2) (2021-09-14)


### Bug Fixes

* **pv-scripts:** replaced file- and raw-loader with asset-module ([6f8cc6e](https://github.com/pro-vision/fe-tools/commit/6f8cc6e44d0db2d429969592a78c6fb7cfa40fdd))





## [4.0.1](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-scripts@4.0.0...@pro-vision/pv-scripts@4.0.1) (2021-09-14)

**Note:** Version bump only for package @pro-vision/pv-scripts





# [4.0.0](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-scripts@3.1.0...@pro-vision/pv-scripts@4.0.0) (2021-09-14)


### Build System

* **pv-scripts:** updated dependencies ([e99141f](https://github.com/pro-vision/fe-tools/commit/e99141f72013b6e55bb2623a719a5f11ee1bf6e7))


### BREAKING CHANGES

* **pv-scripts:** Updated to v4 of webpack-dev-server. there are some breaking changes in the
webpack.config syntax (see
https://github.com/webpack/webpack-dev-server/blob/master/migration-v4.md)





# [3.1.0](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-scripts@3.0.0...@pro-vision/pv-scripts@3.1.0) (2021-02-24)


### Bug Fixes

* **pv-scripts:** support windows seperators as well ([15bf0f2](https://github.com/pro-vision/fe-tools/commit/15bf0f2bb207512e892c22929c720bb957df8549))


### Features

* **webpack-config:** generate exact source-maps for css files ([952f40f](https://github.com/pro-vision/fe-tools/commit/952f40ffd68d750f4185bcb58d6235ce7b4d1f21))





# [3.0.0](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-scripts@2.0.9...@pro-vision/pv-scripts@3.0.0) (2020-10-20)


### Bug Fixes

* **pv-scripts:** use own formatWebpackMessages in all files ([be486fd](https://github.com/pro-vision/fe-tools/commit/be486fda6582cb2156fd49fcdf44c62b083c7701))
* update to the latest source-map-explorer and use --no-border-check to work around thrwon error ([2284aa7](https://github.com/pro-vision/fe-tools/commit/2284aa78929b147257747f77e9232e0867be515a))


### Build System

* **all:** updated all external dependencies ([e0fed79](https://github.com/pro-vision/fe-tools/commit/e0fed79e5173f13733acf81be2874c85fc457900))


### Features

* **pv-scripts:** added disableLegacyBuild flag ([3deeedf](https://github.com/pro-vision/fe-tools/commit/3deeedfec48037da2a80a32a5062c374c389caae))
* **pv-scripts:** fallback to normal index-file, when default legacyIndex does not exist ([c989fbd](https://github.com/pro-vision/fe-tools/commit/c989fbde4705b2bffd49a5ec93f679080437263a))
* **pv-scripts:** generate stats for css bundles ([affbe75](https://github.com/pro-vision/fe-tools/commit/affbe75484ae8deda9590e3ad449b5d652530aba))


### BREAKING CHANGES

* **all:** Webpack-5 conform syntax needed for custom webpack.config files.





## [2.0.9](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-scripts@2.0.8...@pro-vision/pv-scripts@2.0.9) (2020-03-26)

**Note:** Version bump only for package @pro-vision/pv-scripts





## [2.0.8](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-scripts@2.0.7...@pro-vision/pv-scripts@2.0.8) (2020-03-13)

**Note:** Version bump only for package @pro-vision/pv-scripts





## [2.0.7](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-scripts@2.0.6...@pro-vision/pv-scripts@2.0.7) (2020-03-09)

**Note:** Version bump only for package @pro-vision/pv-scripts
