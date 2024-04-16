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

const build = async () => {
  console.log("Assemble LSG...");
  await buildClickdummy();
  await buildLSG();
  console.log("LSG assembled!");
};

build();
