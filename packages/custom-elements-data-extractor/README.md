# Custom Element Data Extractor

Tooling to extract data regarding the properties / attributes of custom elements. And generate custom data for [VSCode auto compilation](https://github.com/microsoft/vscode-html-languageservice/blob/main/docs/customData.md) for custom html tags.

## Usage

Install module as local or global dependency and call as npm script or in the command line with:

```cmd
pv-custom-data --components "src/components/**/*.ts" --iconsDir "resources/icons/" --outDir "data/"
```

```js
// Custom element's js class in src/components/.../pva-e-icon.ts

/**
 * (lazy-loaded) icon element
 */
@tag("pva-e-icon")
class Icon extends Component {

  // svg file name without extension
  @prop
  iconId: string;

  constructor() {
    super({
      props: {
        ratio: { type: "number" }
      }
    });
  }
```

```json
// pv.config.json
{
  "devServerPort": "8023",
  "namespace": "pva"
}
```

```cmd
:: /resources/icons/

|- pva-icon-close.svg
|- pva-icon-plus.svg
```

```json
// generated custom-elements.html-data.json in "/data" folder.
{
  "version": 1.1,
  "tags": [
    {
      "name": "pva-e-icon",
      "description": "(lazy-loaded) icon element",
      "attributes": [
        {
          "name": "icon-id",
          "description": "svg file name without extension",
          "valueSet": "pva-e-icon:icon-id"
        },
        {
          "name": "ratio",
          "description": "",
        }
      ],
      "references": [
        {
          "name": "Living Styleguide",
          "url": "http://localhost:8023/styleguide/index.html#icon"
        }
      ]
    }
  ],
  "valueSets": [
    {
      "name": "pva-e-icon:icon-id",
      "values": [
        {
          "name": "pva-icon-close"
        },
        {
          "name": "pva-icon-plus"
        }
      ]
    }
  ]
}
```

You have to reference the generated file in `.vscode/settings.json`;

```json
// .vscode/settings.json
{
  // ...
  "html.customData": [
    "./path/to/custom-elements.html-data.json"
  ]
}
```

## CLI options

### `-c, --components <components>`

Glob pattern to the directory containing the components. e.g. 'src/components/**/*.ts'.

### `-i, --iconsDir <iconsDir>`

(Optional) relative path to the directory containing svg icons. These icons will be provided as the options for the `icon-id` attribute. e.g. 'resources/icons'.

### `-o, --outDir [outDir]`

Relative path to the directory were the generated HTML customData will be written to.
Use `-o` without a value to generate the .json file to the current working directory. Omit the `-o` flag and no json file will be written to disk.

## Node API

### Example

```javascript
const CustomElementDataExtractor = require("@pro-vision/custom-elements-data-extractor");

// customize
const Extractor = class extends CustomElementDataExtractor {
  /** @overrides */
  getValues({ attributeName, elementName, propData }) {
    // define fixed options for the user-card's `type` attribute
    if (elementName === "pva-user-card" && attributeName === "type") return [
      {name: "Standard"},
      {name: "PRO"},
      {name: "PRO+", description: "will add additional badges"}
    ];
    return super.getValues({ attributeName, elementName, propData });
  }

  /** @overrides */
  getReferences(elementName) {
    // add link to some other domain instead of local LSG instance when hovering over custom elements tags in VSCode
    return [{name: "Documentation", url: `www.my.docs.com/${elementName}`}]
  }
}

const extractor = new Extractor({
  components: path.resolve(process.cwd(), "/src/components/**/*.ts"),
  // other options
  // namespace: "pva",
  // port: "8080",
  // iconsDir: path.join(process.cwd(), "/icons/"),
});

await extractor.extractAllCustomElementsData();

// you will have access to the data via:
// extractor.customElementsData;

// generate html custom data json file
await extractor.writeHTMLCustomData(process.cwd());
```
