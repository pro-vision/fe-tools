const { watchFile } = require("fs-extra");

const { watchGlob } = require("../helper/io-helper");
const { resolveApp, getAppConfig, join } = require("../helper/paths");
// Assemble Clickdummy
const { assembleClickdummyComponents } = require("../tasks/clickdummy/assembleClickdummyComponents");
const { assembleClickdummyPages } = require("../tasks/clickdummy/assembleClickdummyPages");
const { copyClickdummyFiles } = require("../tasks/clickdummy/copyClickdummyFiles");
// Assemble Stylemark
const { buildDDS } = require("../tasks/lsg/buildDDS");

const buildClickdummy = async () => {
  await Promise.all([assembleClickdummyComponents(), assembleClickdummyPages(), copyClickdummyFiles()]);
};

const buildLSG = async () => {
  await buildDDS();
};

const buildAll = async () => {
  console.log("Assemble LSG...");
  await buildClickdummy();
  await buildLSG();
  console.log("LSG assembled!");
};

const watchFiles = () => {
  const { componentsSrc, cdPagesSrc, lsgIndex } = getAppConfig();
  watchGlob(resolveApp(join(componentsSrc, "**/*.md")), () => buildLSG());
  watchGlob(resolveApp(join(cdPagesSrc, "**/*.hbs")), () => assembleClickdummyPages());
  watchFile(resolveApp(lsgIndex), () => copyClickdummyFiles());

  for (const ext of ["hbs", "json", "yaml", "yml"]) {
    watchGlob(resolveApp(join(componentsSrc, `**/*.${ext}`)), () => buildAll());
  }
};

console.log("Assemble LSG in dev-mode...");

const startDev = async () => {
  await buildAll();
  console.log("Start LSG watch...");
  watchFiles();
};

startDev();
