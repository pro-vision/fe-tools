# Language Server for Handlebars files in an assemble(-lite) based project

## Functionality

This Language Server provides

- autocomplete functionality for partials and their parameters, helpers, data objects, css classes.
- goto definition for partials, partial parameters, local handlebars helpers and css classes.

## Example

![Example](https://github.com/pro-vision/fe-tools/tree/master/packages/vscode-pv-handlebars-language-server/images/example.gif)

## Requirement

Workspace where the handlebars templates and partials are in `frontend/src/components` and handlebars helpers directory is defined in `pv.config.js` file.

See assemble-lite's [github page](https://github.com/pro-vision/fe-tools/tree/develop/packages/assemble-lite) for more information.

## Settings

### showHoverInfo `[=true]`

Shows links to documentation of handlebars helpers on hover.

### provideCssClassCompletion `[=true]`

Provides completion for css classes in hbs files based on scss files.

### provideCssClassGoToDefinition `[=true]`

Provides goto definition for css classes to their positions in .scss files.
