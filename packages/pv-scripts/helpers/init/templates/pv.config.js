module.exports = function (appConfig) {
  return `module.exports = {
  // destPath: "target",
  ${
    appConfig.namespace !== ""
      ? `namespace: "${appConfig.namespace}",`
      : '// namespace: "app",'
  }
  // devServerPort: 8616,
  copyStaticFiles: false,
  useTS: ${appConfig.useTS},
  useReact: ${appConfig.useReact},
  ${appConfig.useTS ? "enableTypeCheck: true," : "// enableTypeCheck: false"}
  // jsEntry: "src/index.ts",
  // jsLegacyEntry: "src/legacyIndex.ts",
  // disableLegacyBuild: false,
  // cssEntry: "src/index.scss",
  // autoConsoleClear: false,
};
`;
};
