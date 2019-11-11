module.exports = function({componentName}) {
  return (
`---
layout: default
---

{{> ${componentName}}}
`);
};
