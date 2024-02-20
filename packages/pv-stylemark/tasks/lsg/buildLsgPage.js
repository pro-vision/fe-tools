const { readFile } = require("node:fs/promises");
const { resolve } = require("path");
const hbsInstance = require("handlebars").create();

const { writeFile } = require("../../helper/io-helper");
const { getAppConfig } = require("../../helper/paths");

const registerPartial = async (name, path, hbsInst) => {
  const partialContent = await readFile(resolve(__dirname, path), {
    encoding: "utf-8",
  });
  hbsInst.registerPartial(name, partialContent);
};

const initHandlebars = async hbsInst => {
  await registerPartial("lsg-nav", "../templates/lsg-nav.hbs", hbsInst);
  await registerPartial("lsg-component", "../templates/lsg-component.hbs", hbsInst);
};

const loadTemplate = async hbsInst => {
  const templateContent = await readFile(resolve(__dirname, "../templates/lsg.hbs"), {
    encoding: "utf-8",
  });
  return hbsInst.compile(templateContent);
};

const buildLsgPage = async (lsgData, lsgConfig) => {
  const { destPath } = getAppConfig();
  await initHandlebars(hbsInstance);
  const template = await loadTemplate(hbsInstance);
  const markup = template({ title: "LSG", lsgData, lsgConfig });
  await writeFile(destPath, "styleguide", "index", markup);
};

module.exports = {
  buildLsgPage,
};
