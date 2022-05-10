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

You can also provide custom templates for these files or for some of them, with the boilerplate most suitable for you project (e.g. grid system, common util imports, etc.). These files should be put inside `scripts/create-component/templates` folder and named similar to the default templates (see [lib/templates](https://github.com/pro-vision/fe-tools/tree/master/packages/pv-create-component/lib/templates)).

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
| `dataFile` |string |  |handlebars data is in a yaml or json file. one of ".json", ".yaml" or `undefined` |
| `hasTs` |boolean |  |has a .ts file |
| `hasJs` |boolean |  |has a .js file |
| `hasUnit` |boolean |  |has unit test file |
| `unitType` | `"jest"`/`"karma"` | "jest" |  type of unit tests |
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

### `--help` or `-h`

Prints all CLI options with their descriptions.

## `pv.config.js` options

(see also configuration for [pro-vision/fe-tools/packages/pv-scripts/](https://github.com/pro-vision/fe-tools/tree/master/packages/pv-scripts#basic-configuration))

### `namespace`

Project namespace to be used as a prefix for the component name.

### `useTS` [=true]

Generate TypeScript files instead of Javascript files.

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
  unitType: "karma",
  hasGalen: true,
  gitAdd: false,
});
```
