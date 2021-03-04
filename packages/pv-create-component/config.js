// expects pv projects to have the same structure
// paths are relative to the projects frontend root directory
module.exports = {
  TEMPLATES_DIR: "scripts/create-component/templates",
  COMPONENTS_DIR: "src/components",
  PAGES_DIR: "src/pages",
  SCSS_MAIN: "src/styles/index.scss",
  PAGES_MAIN: "src/styleguide/index.html",
  JS_COMPONENTS_MAIN: "src/js/components/index.js",
  TS_COMPONENTS_MAIN: "src/js/components/index.ts",
  KARMA_MAIN: "src/js/karma/index.spec.js",
  defaultUnitTestType: "jest",
};
