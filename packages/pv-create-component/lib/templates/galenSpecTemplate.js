module.exports = function({ componentName }) {
  return (
`# http://galenframework.com/docs/reference-galen-spec-language-guide/

@objects
  module              .${componentName}
    btn               .${componentName}__btn

= initial =
  @on initial
    module:
      visible
      css color is \${fraColorBlue600A}
`);
};
