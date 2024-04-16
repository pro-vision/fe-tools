const { ensureDir, writeFile: fsWriteFile, watchFile } = require("fs-extra");
const { glob } = require("glob");
const { resolve, normalize } = require("path");

const writeFile = async (target, reldir, filename, markup) => {
  await ensureDir(`${target}/${reldir}`);
  return await fsWriteFile(`${target}/${reldir}/${filename}.html`, markup, {
    encoding: "utf8",
  });
};

const watchGlob = async (curGlob, callback) => {
  const paths = await glob(curGlob, {
    windowsPathsNoEscape: true,
  });
  const normalizedPaths = paths.map(filePath => normalize(resolve(process.cwd(), filePath)));
  normalizedPaths.forEach(path => {
    watchFile(path, () => callback());
  });
};

module.exports = {
  writeFile,
  watchGlob,
};
