# pv-scripts

CLI for zero configuration frontend-toolchain setup.

## Installation

```sh
npm i @pro-vision/pv-scripts
```

## Usage

### Command Line Interface

Installing this package gives you the CLI `pv-scripts`. It can be used with the parameters `dev` and `prod`.

**dev:**
Transpiles and bundles your code (JS/TS/JSX/TSX/SCSS) via `webpack` (+ all needed loaders) and opens a `webpack-dev-server`.

**prod:**
Transpiles and bundles your code (JS/TS/JSX/TSX/SCSS) via `webpack` (+ all needed loaders) and writes them to your target folder.

### Configuration

#### Basic Configuration

Basic Configuration can be done in a `pv.config.js` file in the npm project root-folder. Possible configuration values are:

| key             | type    | default              | usage                                                                                                           |
| --------------- | ------- | -------------------- | --------------------------------------------------------------------------------------------------------------- |
| devServerPort   | number  | 8616                 | set `webpack-dev-server` port                                                                                   |
| destPath        | string  | 'target'             | defines where to put bundled files                                                                              |
| namespace       | string  |                      | this controlls the name-prexix on your bundled files follwing this pattern `[namespace].app.[?legacy].(js|css)` |
| jsEntry         | string  | 'src/index.ts'       | defines path of your (JS\|TS\|JSX\|TSX) entry file                                                              |
| jsLegacyEntry   | string  | 'src/legacyIndex.ts' | defines path of your (JS\|TS\|JSX\|TSX) legacy entry file                                                       |
| cssEntry        | string  | 'src/index.scss'     | defines path of your SCSS entry file                                                                            |
| useTS           | boolean | true                 | defines whether you want to use Typescript                                                                      |
| useReact        | boolean | false                | defines whether you want to use React                                                                           |
| hbsEntry        | string  |                      | defines path of your handlebars entry file                                                                      |
| hbsTarget       | string  |                      | defines path to your handlebars target file                                                                     |
| hbsPartialDir   | string  |                      | defines path to your a handlebars partials directory                                                            |
| copyStaticFiles | boolean | false                | defines whether static folder-content should be copied to target                                                |

##### Example:

```js
// pv.config.js
module.exports = {
  devServerPort: 8616,
  destPath: "target",
  jsEntry: "src/index.js",
  jsLegacyEntry: "src/index.js",
  cssEntry: "src/index.scss",
  useTS: false,
  useReact: false,
  copyStaticFiles: false
};
```

### Further Configurations

For further customization of the webpack-config, specific config-files can be added to the npm project root-folder.

**webpack.config.js:**
Valid webpack.config files which will be merged with both (dev/prod) default configs.

**webpack.config.dev.js:**
Valid webpack.config files which will be merged with the dev default config.

**webpack.config.prod.js:**
Valid webpack.config files which will be merged with the prod default config.
