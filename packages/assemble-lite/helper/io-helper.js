const glob = require("glob");
const fs = require("fs-extra");
const path = require("path");

const asyncGlob = (globPattern) => {
  if (typeof globPattern !== "string") {
    return [];
  }

  return new Promise((resolve, reject) => {
    glob(globPattern, {}, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      // make sure to use absolute paths and that platform separator is used
      resolve(
        files.map((filePath) =>
          path.normalize(path.resolve(process.cwd(), filePath))
        )
      );
    });
  });
};

const getPaths = async (globPattern) => {
  let curPatterns = globPattern;

  if (typeof curPatterns === "string") {
    curPatterns = [globPattern];
  }

  let paths = [];

  await Promise.all(
    curPatterns.map(async (pattern) => {
      const curPaths = await asyncGlob(pattern);
      paths = paths.concat(curPaths);
      return curPaths;
    })
  );

  return paths;
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
