module.exports = function({componentName, isCustomElement}) {
  const tagsName = isCustomElement ? componentName : "div";

  return (
`<${tagsName} class="${componentName}">
  {{${componentName}__data.name}}
</${tagsName}>
`
  );
};
