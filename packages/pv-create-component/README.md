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

### Extend default config

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

/* remove an option by setting it to `undefined` */
config[config.findIndex(item => item.id === "UNIT")] = undefined;


/* allow creating components without type prefix for example for core component */
config.find(item => item.id === "TYPE").prompt.choices.push("Core Component");
// and use as `npm run new -- --namespace cmp --name title` to generate cmp-title files

module.exports = config;
```

See [pv-create-component/types.d.ts](https://github.com/pro-vision/fe-tools/tree/master/packages/pv-create-component/types.d.ts) for info regarding the options.

### New Configuration

If the desired project tech-stack doesn't match the provided default config, a complete new configuration can also be created and used for the create new component cli.
The  file, as was explained in the previous section, is a common js module that is placed at `scripts/create-component/config.js` or the path that is passed via the `--config` parameter and has a default export, that returns a list of configuration items.

Each item consist of 3 optional parts:

```ts
{
  // the question that the user is asked
  prompt?: inquirer.Question;

  // the files that will be created
  files?: Array<{
    // whether or not the file should be created
    // `opt` is an object with the result of all the prompts, plus the cli options
    when?: boolean | ((opt: Options) => boolean);
    // a function which returns the boilerplate code that will be written into te file
    // `opt` is the result of the prompt,
    // plus if there is a prompt with `name: "name"` than its value will be converted to camelCase, kebab-case ... and be part of opt option, similar to what is described in the "Custom Templates" section.
    // plus the cli options
    template: (opt: TemplateOptions) => string;
    // path to store the generated file. is relative to the cmd cwd
    path: (opt: TemplateOptions) => string;
  }>;

  // a modification to an existing file, usually this is an import of the created file
  imports?: Array<{
    // whether or not the import should be added
    // if not set, it falls back to always (i.e. `when: true`)
    when?: boolean | ((opt: Options) => boolean);
    // path of the file where the import statement is added to
    path: string | ((opt: TemplateOptions) => string);
    // should return the import statement or any text which will be added to the file
    template: (opt: TemplateOptions) => string;
    // if provided, the import statement will be placed before this placeholder,
    // otherwise it will be added at the end of file
    placeholder?: string | ((opt: TemplateOptions) => string);
  }>;
}
```

example:

```js
/// <reference types="@pro-vision/pv-create-component/types.d.ts"/>

/**
 * @type {PvCreateComponent.Config}
 */
module.exports = [
  {
    prompt: {
      name: "name",
      type: "input",
      message: "What's the component's name?:",
      validate(value) {
        // only letters and numbers. (no special characters such as '-' and '_')
        const pass = value.match(/(^[a-zA-Z0-9 ]+$)/g);
        if (pass) return true;
        return "Please enter only letters, numbers and spaces";
      },
      filter(name) {
        // " Related Topics " -> "related topics"
        return (
          name
            .trim()
            .toLowerCase()
            // only one empty space between letters is allowed
            .replace(/ ( )+/g, " ")
        );
      },
    },
  },
  {
    prompt: {
      name: "type",
      type: "list",
      message: "What type of component should it be",
      choices: ["UI", "HOC"],
    },
    files: [
      {
        when: (opt) => opt.type === "UI",
        template: require("./templates/uiComponentTemplate"),
        path: (opt) => `src/${opt.kebabCase}.js`,
      },
      {
        when: (opt) => opt.type === "UI",
        template: require("./templates/uiComponentTemplate"),
        path: (opt) => `src/${opt.camelCase}.jsx`,
      },
    ],
    imports: [
      {
        when: (opt) => opt.type === "UI",
        path: "/src/main.js",
        template: (opt) => `import "src/${opt.camelCase}.jsx"`,
        placeholder: "/* IMPORT PLACEHOLDER */",
      },
    ],
  },
];
```

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
