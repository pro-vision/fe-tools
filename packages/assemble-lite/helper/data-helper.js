const { basename, extname } = require("path");
const { readJson, readFile } = require("fs-extra");
const { safeLoad } = require("js-yaml");

const { getPaths } = require("./io-helper");

const loadData = async data => {
  const dataPool = {};
  const dataPaths = await getPaths(data);
  await Promise.all(dataPaths.map(async path => {
    const ext = extname(path);
    const filename = basename(path, ext);

    if (ext === ".json") {
      dataPool[filename] = await readJson(path);
    } else if (ext === ".yaml" || ext === ".yml") {
      dataPool[filename] = safeLoad(await readFile(path, "utf-8"), { filename });
    }
  }));
  return dataPool;
};

module.exports = {
  loadData,
};