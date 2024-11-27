const { resolve, dirname } = require("path");
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

/**
 * @param {Object} config
 * @param {import("./getLsgData.js").StyleMarkLSGData} lsgData
 * @param {import("./getLsgData.js").StyleMarkExampleData} exampleData
 * @param {Function} template
 */
const buildComponentExample = async (config, lsgData, exampleData, template) => {
  const { destPath } = getAppConfig();
  try {
    let componentMarkup = "";
    if (exampleData.exampleMarkup.examplePath) {
      const componentPath = resolveApp(join(destPath, "components", lsgData.componentPath, exampleData.exampleMarkup.examplePath));
      componentMarkup = await readFile(componentPath, { encoding: "utf-8" });
    } else {
      componentMarkup = exampleData.exampleMarkup.content;
    }
    const configBodyHtml = config.examples?.bodyHtml ?? "{html}";
    componentMarkup = configBodyHtml.replace(/{html}/g, componentMarkup);
    // when the `raw` parameter is set in stylemark config, or the markdowns frontmatter or via the parameters of the code block in the markdown,
    // the markup will be used as it is and not wrapped by stylemark generated markup
    const useMarkupRaw = Object.assign({}, config.examples, lsgData.options, exampleData.exampleMarkup.params).raw;
    let markup = "";
    if (useMarkupRaw) {
      const styles = exampleData.exampleStyles.map(style => `<style>${style.content}</style>`).join("\n");
      const scripts = exampleData.exampleScripts.map(script => `<script>${script.content}</script>`).join("\n");
      markup = componentMarkup
        .replace("</head>", `${styles}\n</head>`)
        .replace("</body>", `${scripts}\n</body>`);
    } else {
      markup = template({
        lsgData,
        componentMarkup,
        exampleStyles: exampleData.exampleStyles,
        exampleScripts: exampleData.exampleScripts,
        lsgConfig: config,
      });
    }
    // path to the directory where the referenced example's markup file is, relative to the `componentPath`
    const exampleDir = exampleData.exampleMarkup.examplePath ? dirname(exampleData.exampleMarkup.examplePath) : "";
    await writeFile(destPath, `styleguide/${lsgData.componentPath}/${exampleDir}`, `${lsgData.componentName}-${exampleData.exampleName}`, markup);
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
