const { glob } = require("glob");
const fs = require("fs-extra");
const path = require("path");

const asyncGlob = async (globPattern) => {
  if (typeof globPattern !== "string") {
    return [];
  }

  // consumers (e.g. pv-stylemark) build absolute patterns via path.resolve, which uses
  // backslashes on windows — since glob v9 those count as escape characters and match nothing
  const files = await glob(globPattern, { windowsPathsNoEscape: true });

  // sort to keep partial/page/data registration order deterministic
  // make sure to use absolute paths and that platform separator is used
  return files
    .sort((a, b) => a.localeCompare(b, "en"))
    .map((filePath) => path.normalize(path.resolve(process.cwd(), filePath)));
};

const getPaths = async (globPattern) => {
  let curPatterns = globPattern;

  if (typeof curPatterns === "string") {
    curPatterns = [globPattern];
  }

  const paths = await Promise.all(
    curPatterns.map((pattern) => asyncGlob(pattern))
  );

  return paths.flat();
};

const asyncReadFile = (filePath) => {
  return fs.readFile(filePath, "utf8");
};

const asyncWriteFile = async (target, reldir, filename, markup) => {
  await fs.ensureDir(`${target}/${reldir}`);
  return fs.writeFile(`${target}/${reldir}/${filename}.html`, markup, "utf8");
};

// returns the basename without extension of the provided file path
function getName(filePath) {
  return path.parse(filePath).name;
}

module.exports = {
  getPaths,
  asyncReadFile,
  asyncWriteFile,
  asyncGlob,
  getName,
};
