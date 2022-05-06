module.exports = function({componentName, dataFile}) {
  return (
`---
layout: default
---

{{> ${componentName}${dataFile ? ` @root.${componentName}__data` : ""}}}
`);
};
