const { copyClickdummyFiles } = require("../tasks/clickdummy/copyClickdummyFiles");
const { assembleClickdummyComponents } = require("../tasks/clickdummy/assembleClickdummyComponents");
const { assembleClickdummyPages } = require("../tasks/clickdummy/assembleClickdummyPages");
const { buildDDS } = require("../tasks/lsg/buildDDS");

async function buildStylemarkLsg({ shouldCopyStyleguideFiles = true, shouldAssemble = true } = {}) {
  await Promise.all([
    shouldCopyStyleguideFiles && copyClickdummyFiles(),
    shouldAssemble && assembleClickdummyComponents(),
    shouldAssemble && assembleClickdummyPages(),
  ]);

  await buildDDS();
}

module.exports = buildStylemarkLsg;
