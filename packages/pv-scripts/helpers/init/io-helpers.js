const fs = require("fs-extra");

const asyncCopyFile = async (path, target, filename, newName) => {
  await fs.ensureDir(target);
  return fs.copy(
    `${path}/${filename}`,
    `${target}/${newName === undefined ? filename : newName}`
  );
};

const asyncWriteFile = async (path, filename, contents) => {
  await fs.ensureDir(path);
  return fs.writeFile(`${path}/${filename}`, contents, "utf8");
};

module.exports = {
  asyncCopyFile,
  asyncWriteFile,
};
