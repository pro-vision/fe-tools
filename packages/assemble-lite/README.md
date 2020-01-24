# assemble-lite

Minimal Tool to render Handlebars-Files via Node

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
