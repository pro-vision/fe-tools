const { resolve } = require("path");
const { readFile } = require("fs-extra");
const hbsInstance = require("handlebars").create();

const { writeFile } = require("../../helper/io-helper");
const { resolveApp, getAppConfig, join } = require("../../helper/paths");

const loadTemplate = async hbsInst => {
  const templateContent = await readFile(resolve(__dirname, "../templates/lsg-example.hbs"), {
    encoding: "utf-8",
  });
  return hbsInst.compile(templateContent);
};

const buildComponentExample = async (config, lsgData, exampleData, template) => {
  const { destPath } = getAppConfig();
  const componentPath = resolveApp(join(destPath, "components", lsgData.componentPath, exampleData.examplePath));
  try {
    let componentMarkup = await readFile(componentPath, { encoding: "utf-8" });
    const configBodyHtml = config.examples?.bodyHtml ?? "{html}";
    componentMarkup = configBodyHtml.replace(/{html}/g, componentMarkup);
    const markup = template({
      lsgData,
      componentMarkup,
      exampleStyles: exampleData.exampleStyles,
      lsgConfig: config,
    });
    await writeFile(destPath, "styleguide", `${lsgData.componentName}-${exampleData.exampleName}`, markup);
  } catch (error) {
    console.warn(error);
  }
};

const buildComponentExamples = async (config, lsgData, template) => {
  await Promise.all(lsgData.examples.map(exampleData => buildComponentExample(config, lsgData, exampleData, template)));
};

const buildLsgExamples = async (lsgData, config) => {
  const template = await loadTemplate(hbsInstance);
  await Promise.all(
    lsgData.flatMap(category => category.categoryItems).map(data => buildComponentExamples(config, data, template)),
  );
};

module.exports = {
  buildLsgExamples,
};
