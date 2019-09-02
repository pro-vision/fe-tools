const { basename } = require("path");
const { readJson } = require("fs-extra");

const { getPaths } = require("./io-helper");

const loadData = async data => {
  const dataPool = {};
  const dataPaths = await getPaths(data);
  await Promise.all(dataPaths.map(async path => {
    const filename = basename(path, ".json");
    const curData = await readJson(path);
    dataPool[filename] = curData;
  }));
  return dataPool;
};

module.exports = {
  loadData,
};