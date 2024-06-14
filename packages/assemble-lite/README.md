# assemble-lite

Minimal Tool to render Handlebars-Files via Node.

## Installation

```sh
npm i @pro-vision/assemble-lite -D
```

## Usage

```js
const assembleLite = require('@pro-vision/assemble-lite');

assembleLite({
  baseDir: 'src/pages/',
  partials: 'src/components/**/*.hbs',
  pages: 'src/pages/**/*.hbs',
  templates: 'src/templates/**/*.hbs',
  data: [
    'src/components/**/*.json',
    'src/components/**/*.yaml',
    'src/templates/**/*.json',
    'src/templates/**/*.yml'
  ],
  helpers: 'src/helpers/*.js',
  target: 'target/pages',
}).then(() => {
  console.log('done!!');
});
```

## Configuration

| key           | type            |          usage                            |
| ------------- | ------          | -----------------------------             |
| baseDir       | path            | Defines base directory                    |
| partials  | glob \| glob[]  | where are the partials                    |
| pages     | glob \| glob[]  | where are the pages                       |
| templates | glob \| glob[]  | where are the templates                   |
| data      | glob \| glob[]  | where is the data                         |
| helpers   | glob \| glob[]  | where are the custom handlebars-helpers (the collection from [handlebars-helpers](https://www.npmjs.com/package/handlebars-helpers) is already included - out of the box)                   |
| target        | glob \| glob[]  | defines, where to put the rendered files  |

## Data Files

When generating html files, you can provide some data to be passed to the handlebars template and pages.

These data can be local to the template and would only be applied to it, when set as yaml front-matter in the .hbs file.
Or be global and accessible by all the templates via the handlebars `@root` object. Global data are all `.json`, `.yaml`, `.yml` and `*__data.js` files in the src and pages directory. The js file would need to have a default function that returns a json. This function can also return a promise, but keep in mind that this will slow down the build time and make build caching more difficult.

```js
// some-component__data.js

module.exports = async function() {
  await someFileSystemIO();

  return {
    // the actual data
  };
}
```
