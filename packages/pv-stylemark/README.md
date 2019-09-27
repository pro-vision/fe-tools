# pv-stylemark

CLI for zero configuration stylemark-lsg-toolchain setup.

## Installation

```sh
npm i @pro-vision/pv-stylemark -D
```

## Usage

### Command Line Interface
Installing this package gives you the CLI `pv-stylemark`. It can be used with the parameters `dev` and `prod`. 

**dev:**
Assembles all found hbs files and generates clickdummy (components/pages) and Stylemark - `Living Styleguide`. Starts watches all involved files.

**prod:**
Assembles all found hbs files and generates clickdummy (components/pages) and Stylemark - `Living Styleguide` and writes all to your target folder.

### Webpack Plugin
pv-stylemark also provides a Webpack-Plugin, which can also be used to render the LSG. 

#### Example:
```js
// webpack.config.module.js
const { PvStylemarkPlugin } = require("@pro-vision/pv-stylemark");


module.exports = {
  //...
  plugins: [
    new PvStylemarkPlugin()
  ]
  //...
};
```


### Configuration

#### Basic Configuration
Basic Configuration for both, cli and webpack-plugin, can be done in a `pv.config.js` file in the npm project root-folder. Possible configuration values are:

| key               | type    | default                         |          usage                |
| -------------     | ------  | --------                        | ----------------------------- |
| destPath          | string  | 'target'                        | defines where to put bundled files |
| cdTemplatesHome   | string  | 'src/templates/'                | defines homefolder of clickdummy-templates (glob: `[cdTemplatesHome]**/*.hbs`) |
| lsgTemplatesHome  | string  | 'src/styleguide/templates/'     | defines homefolder of lsg-templates (glob: `[lsgTemplatesHome]**/*.hbs`) |
| componentsHome    | string  | 'src/components/'               | defines homefolder of components (glob: `[componentsHome]**/*.hbs`) |
| cdPagesHome       | string  | 'src/pages/'                    | defines homefolder of clickdummy-pages (glob: `[cdPagesHome]**/*.hbs`) |
| hbsHelperHome     | string  | 'helpers/handlebarsHelper/'     | defines homefolder of additional handlebars-helpers (glob: `[hbsHelperHome]*.js`) |
| lsgAssetsHome     | string  | 'src/assets/'                   | defines homefolder of dummy assets used in lsg and clickdummy (glob: `[lsgAssetsHome]**/*.js`) |
| lsgIndex          | string  | 'src/styleguide/index.html'     | defines path to styleguide landing page html file |
| lsgConfigPath     | string  | 'config/config.stylemark.yaml'  | defines path to lsg config file (which is required) |

##### Example:

```js
// pv.config.js
module.exports = {
  destPath: 'dist',
  cdTemplatesHome: 'src/clickdummy/templates/',
  lsgTemplatesHome: 'src/lsg/templates/',
  cdPagesHome: 'src/clickdummy/pages/',
  hbsHelperHome: 'helper/handlebarsHelper/',
  lsgAssetsHome: 'src/lsg/assets/',
  lsgConfigPath: 'config.stylemark.yaml',
};
```