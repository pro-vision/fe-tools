# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [5.1.0](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-scripts@5.0.1...@pro-vision/pv-scripts@5.1.0) (2024-11-26)


### Bug Fixes

* **pv-scripts:** update sass-loader version ([a69078d](https://github.com/pro-vision/fe-tools/commit/a69078d62d1062ff1ff236163b363e1d5186146c))


### Features

* **pv-scripts:** remove postCss's dir plugin setting ([701e1ba](https://github.com/pro-vision/fe-tools/commit/701e1ba0dee02d7c09ec1e5d067d88c5dce33f48))





## [5.0.1](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-scripts@5.0.0...@pro-vision/pv-scripts@5.0.1) (2024-04-29)


### Bug Fixes

* **pv-scripts:** fixed issue where prod-build process was not finished ([7af5db2](https://github.com/pro-vision/fe-tools/commit/7af5db2f355b7ab65d87eb8877a82304eb8e30f1))





# [5.0.0](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-scripts@4.2.0...@pro-vision/pv-scripts@5.0.0) (2024-04-29)


### Build System

* **pv-scripts:** update webpack dependencies ([9cdae7c](https://github.com/pro-vision/fe-tools/commit/9cdae7c4c477a7057c17d5ad81da6d380069dddb))


### Code Refactoring

* **pv-scripts:** combine all webpack-babel configs for different js file types (js,ts,jsx,tsx) ([f350aa4](https://github.com/pro-vision/fe-tools/commit/f350aa44a9d99b28444f578e2cfae12ebe264798))


### Features

* **pv-scripts:** add additional support for the new es decorators ([584a5a6](https://github.com/pro-vision/fe-tools/commit/584a5a6f334ecb43140410fe704e6fec47f332f4))
* **pv-scripts:** add suport for bundling svg files ([1a08e7d](https://github.com/pro-vision/fe-tools/commit/1a08e7d165dc3ffb8636f69c1ecebcf5ddbe4e8e))
* **pv-scripts:** add support for webpack build caching ([92da961](https://github.com/pro-vision/fe-tools/commit/92da961c543a6ed3f842b843c161c795a3a2acc4))
* **pv-scripts:** choose sass implementation automatically ([13abc3f](https://github.com/pro-vision/fe-tools/commit/13abc3f7e1a1351ea11dd83733857fc70026c7de))
* **pv-scripts:** remove the "legacy" bundle ([0a23007](https://github.com/pro-vision/fe-tools/commit/0a230072ec1cdcaa2779eff921c7be379c4c86bf))
* **pv-scripts:** replace using node-sass with (dart-)sass ([dc9642b](https://github.com/pro-vision/fe-tools/commit/dc9642b30e10f371db49c706070ade9a8bee3ed8))


### BREAKING CHANGES

* **pv-scripts:** Minimum `Node.js` version supported by the webpack plugins is `18.12.0`
* **pv-scripts:** (medium-risk) svg files will automatically be boundled. check
https://github.com/pro-vision/fe-tools/tree/master/packages/pv-scripts#svg-loading to see if you
need to change your configuration
* **pv-scripts:** (low-risk) webpack config is applied to jsx, ts and tsx files even when `useTS` or
`useReact` are false in the pv.config.json. if you prefer to have a custom webpack config for these
files instead, make sure to use `enforce: "pre"` in your custom webpack.config file
* **pv-scripts:** "legacy" output is removed. only the "modern" bundle is generated, without any
"module" or "modern" prefix. this also applies to all configurations (e.g. no
webpack.config.module.js or no `[modern]` group in browserlist)
* **pv-scripts:** see https://sass-lang.com/documentation/breaking-changes for migration from
node-sass to dart-sass





# [4.2.0](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-scripts@4.1.4...@pro-vision/pv-scripts@4.2.0) (2023-06-12)


### Bug Fixes

* **pv-scripts:** update stats output of pv-scripts build ([ff9285d](https://github.com/pro-vision/fe-tools/commit/ff9285da77deb207a0964d91be9a28f8fdb57e57))


### Features

* **pv-scripts:** add support for json report ([c231ab2](https://github.com/pro-vision/fe-tools/commit/c231ab23a370cdb827a3cc92061279c19bfccd71))
* **pv-scripts:** use custom name for the global function to load webpack chunck ([4a6fd8d](https://github.com/pro-vision/fe-tools/commit/4a6fd8dc811ef8db6b3cda8684cf1fab8e2e01b4))


### Performance Improvements

* **pv-scripts:** rethrow error thrown during devserver start ([38093f8](https://github.com/pro-vision/fe-tools/commit/38093f840ec1573668497f778f56372500941760))





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
