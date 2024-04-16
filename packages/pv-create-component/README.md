# Create Component CLI

To accelerate development of new components, a CLI tool is provided.

An interactive command prompt will ask for the new components name,
if it should generate js, scss, hbs files... File names follow the BEM naming convention and put together in one directory.
Warnings will be shown if any file already exist and whether it should be overwritten or not.

The script will then generate these files with some boilerplate code
(i.e. common imports, constructor, dummy props in js file, ccs class, data in hbs template and the css class name in the sccs file)
and import those files in index.js/ts, styles.scss, ...

The Folder structure and File naming is opinionated and based on current p!v projects.

## Install

```bash
npm install --save-dev @pro-vision/pv-create-component
```

## Usage

```bash
pv-create-component
# with flags
pv-create-component --skip galen --verbose
```

## Custom Templates

You can also provide custom templates for these files or for some of them, with the boilerplate most suitable for your project (e.g. grid system, common util imports, etc.). These files should be put inside `scripts/create-component/templates` folder and named similar to the default templates (see [lib/templates](https://github.com/pro-vision/fe-tools/tree/master/packages/pv-create-component/lib/templates)).

Each template should expose a function as it's default export which invoked by an object with the parameters from the cli enquiry response, should return the content of the to be generated file for the new component as a string.

These arguments will be passed to each template independent of the to be generated file type (.hbs, .ts etc)

| Name        | Type           |  Example | Description |
| ------------- |:-------------:| ------:|------------:|
| `name` |string |"related topics" | |
| `uppercase` |string |"Related Topics" | |
| `pascalCase` |string |"RelatedTopics" | |
| `camelCase` |string |"relatedTopics" | |
| `kebabCase` |string |"related-topics" | |
| `constructorName` |string |"PVRelatedTopics" | |
| `componentName` |string |"pv-m-related-topics" | |
| `isCustomElement` |boolean | |component has a js file and therefor is a custom element |
| `type` |string |"Element" | one of: "Element", "Module", "Page" |
| `hasScss` |boolean | |component has .scss file |
| `hasHbs` |boolean | |component has .hbs file |
| `dataFile` |string \| false | |handlebars data is in a yaml or json file. one of ".json", ".yaml" or `false` |
| `hasTs` |boolean |  |has a .ts file |
| `hasJs` |boolean |  |has a .js file |
| `hasUnit` |boolean |  |has unit test file |
| `unit` | `"jest"`/`"karma"` | "jest" |  type of unit tests |
| `hasGalen` |boolean |  |has galen test files |
| `gitAdd` |boolean |  |will be staged with git |

## Imports

Any necessary imports will automatically be added at the end of the main import file (ts, js, scss). But for the link to a new page in Living Styleguide it is expected that the `<!-- IMPORT-PLACEHOLDER -->` placeholder is in the `src/styleguide/index.html` file.

## Cli Options

### `--skip`

Skips asking questions regarding some particular file types / actions and won't generate the file. Options: `galen`, `scss`, `hbs`, `data`, `js`, `ts`, `karma`, `jest` and `git`.

example:

```bash
npx pv-create-component --skip galen git
```

won't generate galen test files and won't git stage the generated files.

### `--unit` (defaults to `jest`)

Type of unit test. Choose one of `jest` (default) or `karma` for karma + jasmine test suits.

example:

```bash
npx pv-create-component --unit karma
# or
npx pv-create-component --unit=karma
```

### `--dontCheck`

Script will ask to generate unit test file (or galen files) even when the cli was told not to generate a js file (scss/hbs respectively).
This could get handy for example when later a test file should be generated for an already existing component.

### `--verbose`

Logs some additional debug information.

### `--name` or `-n`

component name, incase you don't want to answer it in the cli interaction

example:

```bash
npx pv-create-component --name "related topics"
```

### `--namespace` (defaults to pv.config.js#namespace)

namespace used to prefix the component name

### `--config, -C` path to customized configuration

default will look under `scripts/create-component/config.js`

### `--templatesDir` path to the directory containing customized boilerplate templates

default will look under `scripts/create-component/templates`

### `--help` or `-h`

Prints all CLI options with their descriptions.

## `pv.config.js` options

(see also configuration for [pro-vision/fe-tools/packages/pv-scripts/](https://github.com/pro-vision/fe-tools/tree/master/packages/pv-scripts#basic-configuration))

### `namespace`

Project namespace to be used as a prefix for the component name.

### `useTS` [=true]

Generate TypeScript files instead of Javascript files.

## Customize Configuration

Similar to the templates for boilerplate code, the questions asked in the CLI and the logic behind creating the files can be extended or modified.

For this create `scripts/create-component/config.js` which should have a default export of the modified configurations. (See [pv-create-component/config.js](https://github.com/pro-vision/fe-tools/tree/master/packages/pv-create-component/config.js))

```js
const config = require("@pro-vision/pv-create-component/config");

/* add additional files type */
config.push({
  id: "CYPRESS", // identifier which can be used for future overrides/modifications
  prompt: { // see https://github.com/SBoudrias/Inquirer.js for more options
    name: "hasCypress",
    when: (options) => options.hasHbs,
    type: "confirm",
    message: "Add Cypress test?",
    default: true,
  },
  files: [
    {
      id: "CYPRESS-FILE",
      when: (options) => options.hasCypress,
      template: tpl, // function which will return the boilerplate code
      // path of the file to be created
      path: (options) =>
        `src/components/${options.componentName}/specs/e2e/${options.componentName}.cy.ts`,
    },
  ],
});


/* modify existing import placement e.g. instead of the end of index.scss */
config.find(item => item.id === "SCSS").imports[0].placeholder = options =>
  options.type === "Element" ? "/* Element Import */" : "/* Module Import */";


/* allow creating components without type prefix for example for core component */
config.find(item => item.id === "TYPE").prompt.choices.push("Core Component");
// and use as `npm run new -- --namespace cmp --name title` to generate cmp-title files

module.exports = config;
```

See [pv-create-component/types.d.ts](https://github.com/pro-vision/fe-tools/tree/master/packages/pv-create-component/types.d.ts) for info regarding the options.

## Using Programmatically

You can also use the generator directly. For example in a project scaffolding script.

```javascript
const generator = require("@pro-vision/pv-create-component");

await generator({
  namespace: "pv",
  name: "related topics",
  type: "Module",
  hasScss: true,
  hasHbs: true,
  dataFile: ".yaml",
  hasTs: true,
  hasJs: false,
  hasUnit: false,
  unit: "karma",
  hasGalen: true,
  gitAdd: false,
});

// or with customized config
const config = require("@pro-vision/pv-create-component/config");
// modify config as needed

await generator(options, config);
```
