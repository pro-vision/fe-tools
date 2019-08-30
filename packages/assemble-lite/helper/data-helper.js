

const { basename } = require("path");
const { readJson } = require("fs-extra");

const { getPaths } = require("./io-helper");

const loadData = async dataGlob => {
  const data = {};
  const dataPaths = await getPaths(dataGlob);
  await Promise.all(dataPaths.map(async path => {
    const filename = basename(path, ".json");
    const curData = await readJson(path);
    data[filename] = curData;
  }));
  return data;
};

module.exports = {
  loadData,
};