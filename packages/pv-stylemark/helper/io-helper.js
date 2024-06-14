let fs = require("fs-extra");
const { promisify } = require("util");
const { glob } = require("glob");
const { resolve, normalize } = require("path");

// can override the filesystem api used to read and write files, e.g. using memfs via webpack.
function updateFileSystemConnector(fileSystem) {
  fs = fileSystem;
}

function readFile(...args) {
  return promisify(fs.readFile)(...args);
}

const writeFile = async (target, reldir, filename, markup) => {
  await promisify(fs.mkdir)(`${target}/${reldir}`, { recursive: true });
  return promisify(fs.writeFile)(`${target}/${reldir}/${filename}.html`, markup);
};

const watchGlob = async (curGlob, callback) => {
  const paths = await glob(curGlob, {
    windowsPathsNoEscape: true,
  });
  const normalizedPaths = paths.map(filePath => normalize(resolve(process.cwd(), filePath)));
  normalizedPaths.forEach(path => {
    fs.watchFile(path, () => callback());
  });
};

module.exports = {
  writeFile,
  watchGlob,
  updateFileSystemConnector,
  readFile,
};
