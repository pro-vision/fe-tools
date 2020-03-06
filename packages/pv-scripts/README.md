# pv-scripts

CLI for zero configuration frontend-toolchain setup.

## Installation

```sh
npm i @pro-vision/pv-scripts -D
```

## Usage

### Requirements
To use the CLI, you need to create at least the two entry-files (`jsEntry`, `jsLegacyEntry`), see [Basic Configuration](#basic-configuration).

### Command Line Interface

Installing this package gives you the CLI `pv-scripts`. It can be used with the parameters `dev` and `prod`.

To run a locally installed version of the `pv-scripts`, you can either call the `pv-scripts` command directly from your local `node_modules/.bin` folder or by using npx.

**dev:**
Transpiles and bundles your code (JS/TS/JSX/TSX/SCSS) via `webpack` (+ all needed loaders) and opens a `webpack-dev-server` on the configured port (default: 8616).

```sh
npx pv-scripts dev
```

**prod:**
Transpiles and bundles your code (JS/TS/JSX/TSX/SCSS) via `webpack` (+ all needed loaders) and writes them to your target folder.

```sh
npx pv-scripts prod
```

### Configuration

#### Basic Configuration

Basic Configuration can be done in a `pv.config.js` file in the npm project root-folder. Possible configuration values are:

| key             | type    | default              | usage                                                                                                           |
| --------------- | ------- | -------------------- | --------------------------------------------------------------------------------------------------------------- |
| devServerPort   | number  | 8616                 | set `webpack-dev-server` port                                                                                   |
| srcPath         | string  | "src"                | defines the working directory                                                                                   |
| destPath        | string  | "target"             | defines where to put bundled files                                                                              |
| namespace       | string  | ""                   | this controls the name-prefix on your bundled files following this pattern `[namespace].app.[?legacy].(js|css)` |
| jsEntry         | string  | "src/index.ts"       | defines path of your (JS\|TS\|JSX\|TSX) entry file                                                              |
| jsLegacyEntry   | string  | "src/legacyIndex.ts" | defines path of your (JS\|TS\|JSX\|TSX) legacy entry file                                                       |
| cssEntry        | string  | "src/index.scss"     | defines path of your SCSS entry file. If `src/index.scss` does not exist, no error is thrown but the css generation is simply skipped|
| useTS           | boolean | true                 | defines whether you want to use Typescript                                                                      |
| useReact        | boolean | false                | defines whether you want to use React                                                                           |
| hbsEntry        | string  |                      | defines path of your handlebars entry file                                                                      |
| hbsTarget       | string  |                      | defines path to your handlebars target file                                                                     |
| handlebarsLoaderOptions   | string  | {}         | Object with additional options for the `handlebars-loader`. See https://github.com/pcardune/handlebars-loader for these options. Paths are relative to `pv.config.js`                                                       |
| copyStaticFiles | boolean | false                | defines whether content of `/static` should be copied to target                                                 |
| cleanDest       | boolean | false                | defines whether the destination folder should be cleaned before every pv-scripts run                            |
| fontsSrc        | string  | "resources/fonts/"   | defines folder in which the fonts are located                                                                   |
| resourcesSrc    | string  | "resources"           | defines resources folder which is copied to target/resources                                                   |
| autoConsoleClear | boolean  | "false"              | defines whether the console should be cleared automatically in dev-mode                                        |

##### Example:

```js
// pv.config.js
module.exports = {
  devServerPort: 8616,
  destPath: "target",
  jsEntry: "src/index.js",
  jsLegacyEntry: "src/legacyIndex.js",
  cssEntry: "src/index.scss",
  useTS: false,
  useReact: false,
  copyStaticFiles: false
};
```

### Further Configurations

For further customization of the webpack-config, specific config-files can be added to the npm project root-folder.

**webpack.config.js:**
Valid webpack.config file which will be merged with both (dev/prod) default configs.

**webpack.config.module.js:**
Valid webpack.config file which will be merged with the module build of both (dev/prod) default configs.

**webpack.config.legacy.js:**
Valid webpack.config file which will be merged with the legacy build of both (dev/prod) default configs.

**webpack.config.dev.js:**
Valid webpack.config file which will be merged with the dev default config.

**webpack.config.dev.module.js:**
Valid webpack.config file which will be merged with the module build of the dev default config.

**webpack.config.dev.legacy.js:**
Valid webpack.config file which will be merged with the legacy build of the dev default config.

**webpack.config.prod.js:**
Valid webpack.config file which will be merged with the prod default config.

**webpack.config.prod.module.js:**
Valid webpack.config file which will be merged with the module build of the prod default config.

**webpack.config.prod.legacy.js:**
Valid webpack.config file which will be merged with the legacy build of the prod default config.

#### Browserslist

A default browser query is used for compiling javascript and css. i.e. IE11 for the "legacy" bundle and latest 2 versions of evergreen browsers (chrome, firefox, safari, edge) for the "modern" bundle. And all combined for the css output. You can define your own [browserslist](https://github.com/browserslist/browserslist) to override any of these target groups. Don't forget to define default browsers, browser for `[modern]` or `[legacy]` environment. See default [.browserslistrc](https://github.com/pro-vision/fe-tools/tree/master/packages/webpack-config/src/config/.browserslistrc) file for an example.

## Examples

You can find example projects in the `examples` folder:

* React with TypeScript: [react-tsx](https://github.com/pro-vision/fe-tools/tree/master/examples/react-tsx)

