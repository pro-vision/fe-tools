module.exports = function({componentName, isCustomElement, dataFile}) {
  const tagsName = isCustomElement ? componentName : "div";

  return (
`<${tagsName} class="${componentName}">
  ${dataFile ? "{{name}}" : ""}
</${tagsName}>
`
  );
};
