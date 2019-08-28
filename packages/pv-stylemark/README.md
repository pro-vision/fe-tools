# pv-stylemark

CLI for zero configuration stylemark-lsg-toolchain setup.

## Installation

```sh
npm i @pro-vision/pv-stylemark
```

## Usage

### Command Line Interface
Installing this package gives you the CLI `pv-stylemark`. It can be used with the parameters `dev` and `prod`. 

**dev:**
Assembles all found hbs files and generates clickdummy (components/pages) and Stylemark - `Living Styleguide`. Starts watches all involved files.

**prod:**
Assembles all found hbs files and generates clickdummy (components/pages) and Stylemark - `Living Styleguide` and writes all to your target folder.


### Configuration

#### Basic Configuration
Basic Configuration can be done in a `pv.config.js` file in the npm project root-folder. Possible configuration values are:

| key           | type    | default  |          usage                |
| ------------- | ------  | -------- | ----------------------------- |
| destPath      | string  | 'target' | defines where to put bundled files |

##### Example:

```js
// pv.config.js
module.exports = {
  destPath: 'dist',
};
```
