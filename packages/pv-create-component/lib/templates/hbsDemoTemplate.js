module.exports = function({componentName, dataFile, hasHbs}) {
  return (
`---
layout: default
---

${hasHbs ? `{{> ${componentName}${dataFile ? ` @root.${componentName}__data` : ""}}}` : ""}
`);
};
