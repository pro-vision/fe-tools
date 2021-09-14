# handlebars-helpers

Collection of useful Handlebars Helpers.

## Installation

```sh
npm i @pro-vision/handlebars-helpers -D
```

## Usage

```javascript
const pvHandlebarsHelpers = require('@pro-vision/handlebars-helpers');

module.exports = pvHandlebarsHelpers;
```


## Helpers

### pv-choose

Helper to Fallback to a Default value, if the given property is undefined.

```hbs
<h1>{{pv-choose headline 'Default Headline'}}</h1>
```


### pv-colors

Helper to render color-overview form given scss-file.

*Example scss file*

```scss
// LSG-Color-Group
// Group-Name: Basic Colors
$my-color__black: #000;
$my-color__white: #fff;

// LSG-Color-Group
// Group-Name: Red
// Group-Description: My Red Color Palette
$my-color__red-300: #E57373;
$my-color__red-400: #EF5350;
$my-color__red-500: #F44336;
$my-color__red-600: #E53935;
$my-color__red-700: #D32F2F;

// LSG-Color-Group
// Group-Name: Blue
// Group-Description: My Blue Color Palette
$my-color__blue-300: #64B5F6;
$my-color__blue-400: #42A5F5;
$my-color__blue-500: #2196F3;
$my-color__blue-600: #1E88E5;
$my-color__blue-700: #1976D2;
```

*Example hbs file*
```hbs
{{#pv-colors "src/colors.scss" "$my-color" this}}
  <h3 class="headline">{{this.groupName}}</h3>

  {{#if this.groupDescription}}
    <h4 class="group-description">{{this.groupDescription}}</h4>
  {{/if}}

  {{#each this.colorInfos}}
    <div class="color">
      <div class="color__tile" style="background: {{this.hex}}"></div>
      <div class="color__description">
        <p class="colors__name"><b>Name:</b> {{this.name}}</p>
        <p class="color__hex"><b>Hex-value:</b> {{this.hex}}</p>
      </div>
    </div>
  {{/each}}
{{/pv-colors}}
```


### pv-concat

Helper to concat strings

```hbs
{{> headline text=(pv-concat "Hi" " " userName) }}
```


### pv-icons

Helper to render icon-overview form given filenames

*Example folder-structure*

```bash
.
├── icons
│   ├── my-icon-arrow.svg
│   ├── my-icon-plus.svg
│   ├── my-icon-check.svg
│   └── my-icon-info.svg
```

*Example hbs-file*

```hbs
{{#pv-icons "icons/" "my-icon" this}}
  <span style="width: 100px; height: 100px; background: #f5f5f5; margin: 2px; padding: 10px; display: inline-block;">
    <my-e-icon class="my-e-icon" icon-id="{{this.id}}"></my-e-icon>
  </span>
{{/pv-icons}}
```


### pv-path

Helper to render optional nested paths.

```hbs
  <img src="{{pv-path @root this.src}}" />
```

To signal a nested page just add nestedPath to pages frontmatter yml.