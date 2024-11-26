# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.2.0](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-stylemark@4.1.0...@pro-vision/pv-stylemark@4.2.0) (2024-11-26)


### Features

* **assemble-lite, pv-stylemark, vscode-pv-handlebars-language-server:** data for templates from js ([366ef09](https://github.com/pro-vision/fe-tools/commit/366ef09ea64853c9f7bd37d3b0f885c351024702)), closes [#235](https://github.com/pro-vision/fe-tools/issues/235)





# [4.1.0](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-stylemark@4.0.5...@pro-vision/pv-stylemark@4.1.0) (2024-04-29)


### Bug Fixes

* **pv-stylemark:** fix regex extracting css code block ([fe3bb8d](https://github.com/pro-vision/fe-tools/commit/fe3bb8d4a12b194615fd40b1bd5ca6fda0e6dc5b))


### Features

* **pv-scripts:** add option to use the styleguide's example markup without modification ([c5a5e66](https://github.com/pro-vision/fe-tools/commit/c5a5e6606949d36815a69f8f648cfff25308aa8a)), closes [#227](https://github.com/pro-vision/fe-tools/issues/227)
* **pv-stylemark:** add info regarding the source of the components styleguide to the new stlymark ([59deaac](https://github.com/pro-vision/fe-tools/commit/59deaac005f60d7dbd9cdeac70022e42cc8e96fd))
* **pv-stylemark:** add styling for table and blockquote from the markdown ([f363928](https://github.com/pro-vision/fe-tools/commit/f363928cde46f24a35543278265843e0adc6af82))
* **pv-stylemark:** add suport for js and html executable code blocks. support the hidden attribute ([9afa746](https://github.com/pro-vision/fe-tools/commit/9afa746f9df49913fcb328296512628678bf4cf9))





## [4.0.5](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-stylemark@4.0.4...@pro-vision/pv-stylemark@4.0.5) (2024-03-04)


### Bug Fixes

* **pv-stylemark:** alphabetically sort categories by default ([11bf7ee](https://github.com/pro-vision/fe-tools/commit/11bf7ee327c5d36c536850838e998e698e21ba6a))





## [4.0.4](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-stylemark@4.0.3...@pro-vision/pv-stylemark@4.0.4) (2024-02-27)


### Bug Fixes

* **pv-stylemark:** fixed html-box overflow issue ([0515c15](https://github.com/pro-vision/fe-tools/commit/0515c1587e29ac1b36ffcda7405fcde0dd1fcd16))





## [4.0.3](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-stylemark@4.0.2...@pro-vision/pv-stylemark@4.0.3) (2024-02-21)


### Bug Fixes

* **pv-stylemark:** fixed lsg asset loading issue ([80c9da0](https://github.com/pro-vision/fe-tools/commit/80c9da0798880c763c2c808bbf3d17c7a3949077))





## [4.0.2](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-stylemark@4.0.1...@pro-vision/pv-stylemark@4.0.2) (2024-02-21)


### Bug Fixes

* **pv-stylemark:** fixed windows path issue ([f03a00a](https://github.com/pro-vision/fe-tools/commit/f03a00ad7b4b62f1c19c72a22a91b64c83fee138))





## [4.0.1](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-stylemark@4.0.0...@pro-vision/pv-stylemark@4.0.1) (2024-02-20)

**Note:** Version bump only for package @pro-vision/pv-stylemark





# [4.0.0](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-stylemark@3.0.11...@pro-vision/pv-stylemark@4.0.0) (2024-02-20)


### Code Refactoring

* **pv-stylemark:** replaced stylemark with own impl ([2ae386d](https://github.com/pro-vision/fe-tools/commit/2ae386d85557cbd13b2a6dfed8ec3366c36bdf51))


### BREAKING CHANGES

* **pv-stylemark:** With removing stylemark the seperate lsg-assets folder is not needed anymore. If
you want to use assets in your LSG you have to copy them seperatly, pv-scripts users can just use
the resources folder in most cases. Also the minimal required node-version has changed to node 18.





## [3.0.11](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-stylemark@3.0.10...@pro-vision/pv-stylemark@3.0.11) (2023-06-12)

**Note:** Version bump only for package @pro-vision/pv-stylemark





## [3.0.10](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-stylemark@3.0.9...@pro-vision/pv-stylemark@3.0.10) (2022-05-06)

**Note:** Version bump only for package @pro-vision/pv-stylemark





## [3.0.9](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-stylemark@3.0.8...@pro-vision/pv-stylemark@3.0.9) (2022-05-06)

**Note:** Version bump only for package @pro-vision/pv-stylemark





## [3.0.8](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-stylemark@3.0.7...@pro-vision/pv-stylemark@3.0.8) (2022-01-19)

**Note:** Version bump only for package @pro-vision/pv-stylemark





## [3.0.7](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-stylemark@3.0.6...@pro-vision/pv-stylemark@3.0.7) (2021-11-15)


### Bug Fixes

* **pv-stylemark:** use glob pattern to target files instead of directory to work around windows bug ([b14287e](https://github.com/pro-vision/fe-tools/commit/b14287e4e3876a8a013b3d9553c05a0a6b0bc468))





## [3.0.6](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-stylemark@3.0.5...@pro-vision/pv-stylemark@3.0.6) (2021-09-14)

**Note:** Version bump only for package @pro-vision/pv-stylemark





## [3.0.5](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-stylemark@3.0.4...@pro-vision/pv-stylemark@3.0.5) (2021-09-14)


### Bug Fixes

* **pv-stylemark:** fixed wrong paths in dev and prod scripts ([27da1d9](https://github.com/pro-vision/fe-tools/commit/27da1d9ea44047b463babfc2d2938147102479a4))





## [3.0.4](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-stylemark@3.0.3...@pro-vision/pv-stylemark@3.0.4) (2021-02-24)


### Bug Fixes

* **pv-stylemark:** removed flat mathod and Assemble Instance ([85b6ca8](https://github.com/pro-vision/fe-tools/commit/85b6ca8cd80dc92081719f87620ac2ae48e01ab1))





## [3.0.3](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-stylemark@3.0.2...@pro-vision/pv-stylemark@3.0.3) (2021-02-24)

**Note:** Version bump only for package @pro-vision/pv-stylemark





## [3.0.2](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-stylemark@3.0.1...@pro-vision/pv-stylemark@3.0.2) (2021-02-24)

**Note:** Version bump only for package @pro-vision/pv-stylemark





## [3.0.1](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-stylemark@3.0.0...@pro-vision/pv-stylemark@3.0.1) (2021-02-24)


### Bug Fixes

* **pv-stylemark:** add missing watchers for handlebars helpers and other assets for lsg ([5fb4d9a](https://github.com/pro-vision/fe-tools/commit/5fb4d9a0a10d81b368048ea5142dad7c9e88ebc6))
* **pv-stylemark:** update for webpack v5 API ([3e56997](https://github.com/pro-vision/fe-tools/commit/3e56997fa74c90b75e0b6d5b3f094c4fbbfae960))


### Performance Improvements

* **pv-stylemark:** move adding files to watch list to the emit phase ([43b2485](https://github.com/pro-vision/fe-tools/commit/43b2485484c203682e37a01542d4cc76ea9fdf42))
* **pv-stylemark:** only run stylemark jobs when neccesery ([005b4dc](https://github.com/pro-vision/fe-tools/commit/005b4dc73a742dd26775b3426f0ae2adcb7642e5))
* **pv-stylemark:** use async spawn to run assemble scripts in parallel ([016ffd5](https://github.com/pro-vision/fe-tools/commit/016ffd5ec8c934a977eaa173d5a2ae4c058f4fd1))
* **pv-stylemark/assemble-lite:** add new variation of assemble-lite which has a statefull instance ([ebf78b6](https://github.com/pro-vision/fe-tools/commit/ebf78b6216d46a36ec615d1f9f26f5a959fe039e))





# [3.0.0](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-stylemark@2.0.6...@pro-vision/pv-stylemark@3.0.0) (2020-10-20)


### Build System

* **all:** updated all external dependencies ([e0fed79](https://github.com/pro-vision/fe-tools/commit/e0fed79e5173f13733acf81be2874c85fc457900))


### BREAKING CHANGES

* **all:** Webpack-5 conform syntax needed for custom webpack.config files.





## [2.0.6](https://github.com/pro-vision/fe-tools/compare/@pro-vision/pv-stylemark@2.0.5...@pro-vision/pv-stylemark@2.0.6) (2020-03-26)

**Note:** Version bump only for package @pro-vision/pv-stylemark
