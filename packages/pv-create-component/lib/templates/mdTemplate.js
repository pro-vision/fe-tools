module.exports = function({name, componentName, type}) {
  return `---
name: ${name}
category: ${type}s
---

@TODO: Descriptive Text goes here.

\`\`\`${componentName}:demo/${componentName}--demo.html
\`\`\`
`;
};
