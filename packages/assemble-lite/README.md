# assemble-lite

Minimal Tool to render Handlebars-Files via Node

## Installation

```sh
npm i @pro-vision/assemble-lite
```

## Usage

```js
const assembleLite = require('@pro-vision/assemble-lite');

assembleLite({
  baseDir: 'src/pages/',
  partialsGlob: 'src/components/**/*.hbs',
  pagesGlob: 'src/pages/**/*.hbs',
  templatesGlob: 'src/templates/**/*.hbs',
  dataGlob: ['src/components/**/*.json', 'src/templates/**/*.json'],
  helpersGlob: 'src/helpers/*.js',
  target: 'target/pages',
}).then(() => {
  console.log('done!!');
});
```

## Configuration

| key           | type            |          usage                            |
| ------------- | ------          | -----------------------------             |
| baseDir       | path            | Defines base directory                    |
| partialsGlob  | glob \| glob[]  | where are the partials                    |
| pagesGlob     | glob \| glob[]  | where are the pages                       |
| templatesGlob | glob \| glob[]  | where are the templates                   |
| dataGlob      | glob \| glob[]  | where is the data (at the moment only .json files are supported)                        |
| helpersGlob   | glob \| glob[]  | where are the custom handlebars-helpers (the collection from [handlebars-helpers](https://www.npmjs.com/package/handlebars-helpers) is already included - out of the box)                   |
| target        | glob \| glob[]  | defines, where to put the rendered files  |