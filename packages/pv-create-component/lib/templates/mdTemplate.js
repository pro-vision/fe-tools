module.exports = function({uppercase, componentName, type}) {
  return `---
name: ${uppercase}
category: ${type}s
---

@TODO: Descriptive Text goes here.

\`\`\`${componentName}:demo/${componentName}--demo.html
\`\`\`
`;
};
