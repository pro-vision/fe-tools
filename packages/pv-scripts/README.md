# pv-scripts

CLI for zero configuration frontend-toolchain-setup.

## Installation

```sh
npm i @pro-vision/pv-scripts -D
```

## Usage

### Requirements
To use the CLI, you need to create at least the entry-file (`jsEntry`), see [Basic Configuration](#basic-configuration).

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

#### CLI flags

##### `--stats` or `--statsJson`
Webpack build will use [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) to generate an html report or json output regarding the bundle sizes and its composition. Which will be stored under `target/report.html` and `target/report.json`.

This flag should only be used in combination with `prod` build to have a realistic information from the optimized bundles.

### Configuration

#### Basic Configuration

Basic Configuration can be done in a `pv.config.js` file in the npm project root-folder. Possible configuration values are:

| key             | type    | default              | usage                                                                                                           |
| --------------- | ------- | -------------------- | --------------------------------------------------------------------------------------------------------------- |
| devServerPort             | number  | 8616                 | set `webpack-dev-server` port                                                                                   |
| srcPath                   | string  | "src"                | defines the working directory                                                                                   |
| destPath                  | string  | "target"             | defines where to put bundled files                                                                              |
| namespace                 | string  | ""                   | this controls the name-prefix on your bundled files following this pattern `[namespace].app.(js|css)`           |
| jsEntry                   | string  | "src/index.ts"       | defines path of your (JS\|TS\|JSX\|TSX) entry file                                                              |
| cssEntry                  | string  | "src/index.scss"     | defines path of your SCSS entry file. If `src/index.scss` does not exist, no error is thrown but the css generation is simply skipped|
| useTS                     | boolean | true                 | defines whether you want to use Typescript                                                                      |
| enableTypeCheck           | boolean | true                 | defines whether the TypeScript type-check (`fork-ts-checker-webpack-plugin`) runs during the build. Only applies when `useTS` is `true`. Set to `false` to skip type-checking (see [Troubleshooting](#troubleshooting)) |
| useReact                  | boolean | false                | defines whether you want to use React                                                                           |
| hbsEntry                  | string  |                      | defines path of your handlebars entry file                                                                      |
| hbsTarget                 | string  |                      | defines path to your handlebars target file                                                                     |
| handlebarsLoaderOptions   | string  | {}         | Object with additional options for the `handlebars-loader`. See https://github.com/pcardune/handlebars-loader for these options. Paths are relative to `pv.config.js`                                                       |
| copyStaticFiles | boolean | false                | defines whether content of `/static` should be copied to target                                                 |
| cleanDest       | boolean | false                | defines whether the destination folder should be cleaned before every pv-scripts run                            |
| fontsSrc        | string  | "resources/fonts/"   | defines folder in which the fonts are located                                                                   |
| resourcesSrc    | string  | "resources"           | defines resources folder which is copied to target/resources                                                   |
| autoConsoleClear | boolean  | false              | defines whether the console should be cleared automatically in dev-mode                                        |
| enableContentHash | boolean  | false              | defines whether generated js and css files should contain a content hash in their names                                         |
| babelDecorator  | string  | "legacy"             | @babel/plugin-proposal-decorators' `version` property                                                           |

##### Example

```js
// pv.config.js
module.exports = {
  devServerPort: 8616,
  destPath: "target",
  jsEntry: "src/index.js",
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

**webpack.config.dev.js:**
Valid webpack.config file which will be merged with the dev default config.

**webpack.config.prod.js:**
Valid webpack.config file which will be merged with the prod default config.

**.babelrc.json**
Will add additional babel plugins to the existing [webpack config](https://github.com/pro-vision/fe-tools/tree/master/packages/pv-scripts/webpack/base/tasks/compileJS.js)

#### SVG loading

svg files will be automatically loaded when imported/referenced by js/ts/scss files.

Default behavior would be to extract the svg content when requested from js (this would allow to use the svg content easily to render markup), for css the svg will be emitted as a .svg file to the target folder and its url used in the output css. These can be overwritten by webpacks resource queries:

| query | behavior | example |
|-------|----------|---------|
| `resource` or `external`  |  resource will be emitted to target folder and its url added to the import  |  `import svgUrl from("./icon.svg?resource"); fetch(svgUrl);` |
|  `inline` |  svg content will be base64 encoded an used inline  |  `background-image: url("./img.svg?inline"); // => background-image: url(data:image/svg+xml;base64,PHN...` |
| `auto`  | webpack will automatically choose between `resource` and `inline` based on the file size see [webpack's documentation](https://webpack.js.org/guides/asset-modules/).  |   |
| `source` or `raw`  |  the svg files content will be used  | `import svgContent from("./icon.svg?raw");  el.innerHTML = svgContent;`  |
| `/*! webpackIgnore: true */`  |  will ignore the file/url   |  `/* webpackIgnore: true */ background-image: url("http//some-url.svg");` |

#### SASS compilation

Per default the new (dart-)`sass` package will be installed and used. You can also install the `sass-embedded` package as an npm dependency which will then be automatically used and is twice as fast as the default sass. If you need to use the legacy [sass syntax](https://sass-lang.com/documentation/breaking-changes/) (e.g. `/` instead of `math.div`) then you need to install `node-sass` as an npm dependency, and it will automatically be used when sass code is compiled.

#### Browserslist

A default browser query is used for compiling javascript and css. i.e. latest 2 versions of evergreen browsers (chrome, firefox, safari, edge). You can define your own [browserslist](https://github.com/browserslist/browserslist). See default [.browserslistrc](https://github.com/pro-vision/fe-tools/tree/master/packages/pv-scripts/config/.browserslistrc) file for an example.

## Troubleshooting

### `EMFILE: too many open files, watch` in `dev` mode (macOS)

If `pv-scripts dev` crashes on macOS with an error like:

```
Error: EMFILE: too many open files, watch
    at FSWatcher._handle.onchange (node:internal/fs/watchers)
    ...
    at NodeFsHandler._boundHandleError (node_modules/chokidar/handler.js)
```

this is caused by the TypeScript type-check watcher opening one file descriptor
per watched directory. `fork-ts-checker-webpack-plugin@9.1.0` bumped its `chokidar`
dependency from 3 to 4, and `chokidar@4` dropped `fsevents` support. Without
`fsevents`, macOS falls back to native `fs.watch` (one descriptor per directory)
instead of a single `fsevents` stream, so a large watch tree (e.g. a `tsconfig.json`
without an `include`, which makes TypeScript watch the whole project root incl.
`node_modules`) can exhaust the per-process descriptor limit.

**pv-scripts pins `fork-ts-checker-webpack-plugin` to `9.0.3`** (which still uses
`chokidar@3` + `fsevents`), so upgrading pv-scripts fixes this. Additional
mitigations:

- Give your `tsconfig.json` an explicit `"include": ["src"]` so the type-check
  watches only your sources instead of the whole project root.
- If you are stuck on an affected version, force `chokidar@3` in your project's
  `package.json`:

  ```json
  "overrides": {
    "fork-ts-checker-webpack-plugin": { "chokidar": "^3.6.0" }
  }
  ```

- As a last resort, disable the type-check watcher in dev via `pv.config.js`:

  ```js
  // pv.config.js
  module.exports = {
    enableTypeCheck: false,
  };
  ```

  (This turns off the type-check for both `dev` and `prod`; run `tsc --noEmit`
  separately if you still want type-checking in CI.)

## Examples

You can find example projects in the `examples` folder:

* React with TypeScript: [react-tsx](https://github.com/pro-vision/fe-tools/tree/master/examples/react-tsx)
