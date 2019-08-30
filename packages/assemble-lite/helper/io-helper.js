

const glob = require("glob");
const fs = require("fs-extra");

const asyncGlob = globPattern => {
  if (typeof globPattern !== "string") {
    return [];
  }

  return new Promise((resolve, reject) => {
    glob(globPattern, {}, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(files);
    });
  });
};

const getPaths = async globPattern => {
  let curPatterns = globPattern;

  if (typeof curPatterns === "string") {
    curPatterns = [globPattern];
  }

  let paths = [];

  await Promise.all(curPatterns.map(async pattern => {
    const curPaths = await asyncGlob(pattern);
    paths = paths.concat(curPaths);
    return curPaths;
  }));

  return paths;
};

const asyncReadFile = filePath => fs.readFile(filePath, "utf8");

const asyncWriteFile = async (target, reldir, filename, markup) => {
  await fs.ensureDir(`${target}/${reldir}`);
  return fs.writeFile(`${target}/${reldir}/${filename}.html`, markup, "utf8");
};

module.exports = {
  getPaths,
  asyncReadFile,
  asyncWriteFile
};