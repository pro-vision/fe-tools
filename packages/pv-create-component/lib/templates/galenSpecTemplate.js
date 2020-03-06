module.exports = function({ componentName, isCustomElement }) {
  return (
`# http://galenframework.com/docs/reference-galen-spec-language-guide/

@lib galen-extras

@import ../../../../js/galen/specs/colors.gspec

@objects
  module              ${isCustomElement ? componentName : `.${componentName}`}
    btn               .${componentName}__btn

= initial =
  @on initial
    module:
      visible
`);
};
