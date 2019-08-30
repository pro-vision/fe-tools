# pv-scripts

CLI for zero configuration frontend-toolchain setup.

## Installation

```sh
npm i @pro-vision/pv-scripts
```

## Usage

### Requirements
To use the CLI, you need to create at least the three entry-files (`jsEntry`, `jsLegacyEntry`, `cssEntry`, see [Basic Configuration](#Basic Configuration)).

### Command Line Interface
Installing this package gives you the CLI `pv-scripts`. It can be used with the parameters `dev` and `prod`. 

To run a locally installed version of the `pv-scripts`, you can either call the `pv-scripts` command directly from your local `node_modules/.bin` folder or by using npx.

```sh
npx pv-scripts dev
``` 

**dev:**
Transpiles and bundles your code (JS/TS/JSX/TSX/SCSS) via `webpack` (+ all needed loaders) and opens a `webpack-dev-server` on the configured port (default: 8616).

**prod:**
Transpiles and bundles your code (JS/TS/JSX/TSX/SCSS) via `webpack` (+ all needed loaders) and writes them to your target folder.

### Configuration

#### Basic Configuration
Basic Configuration can be done in a `pv.config.js` file in the npm project root-folder. Possible configuration values are:

| key           | type    | default  |          usage                |
| ------------- | ------  | -------- | ----------------------------- |
| devServerPort | number  | 8616     | set `webpack-dev-server` port |
| destPath      | string  | 'target' | defines where to put bundled files |
| namespace     | string  | ''       | this controlls the name-prexix on your bundled files follwing this pattern `[namespace].app.[?legacy].(js|css)` |
| jsEntry       | string  | 'src/js/index.ts' | defines path of your (JS\|TS\|JSX\|TSX) entry file |
| jsLegacyEntry | string  | 'src/js/legacyIndex.ts' | defines path of your (JS\|TS\|JSX\|TSX) legacy entry file |
| cssEntry      | string  | 'src/styles/main.scss' | defines path of your SCSS entry file |
| useTS         | boolean | true | defines whether you want to use Typescript |
| useReact      | boolean | false | defines whether you want to use React |

##### Example:

```js
// pv.config.js
module.exports = {
  devServerPort: '8080',
  namespace: 'my-app',
  useReact: true,
  useTS: false,
  jsEntry: 'src/index.jsx',
  jsLegacyEntry: 'src/indexLegacy.jsx',
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

## Examples

You can find example projects in the `examples` folder:

* React with TypeScript: [react-tsx](https://github.com/pro-vision/fe-tools/tree/master/examples/react-tsx)