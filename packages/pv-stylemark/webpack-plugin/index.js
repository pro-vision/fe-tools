const path = require("path");

const buildStylemark = require("../scripts/buildStylemarkLsg");
const { getFilesToWatch } = require("./getFilesToWatch");

class PvStylemarkPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapPromise("PvStylemarkPlugin", () => {
      return buildStylemark();
    });

    compiler.hooks.afterCompile.tapAsync(
      "PvStylemarkPlugin",
      (compilation, callback) => {
        getFilesToWatch().then(files => {
          // make sure platform separator is used
          files = files.map(path.normalize);

          if (Array.isArray(compilation.fileDependencies)) {
            compilation.fileDependencies.push(...files);
          } else {
            files.forEach(file => {
              return compilation.fileDependencies.add(file);
            });
          }
          callback();
        });
      }
    );
  }
}

module.exports = {
  PvStylemarkPlugin
};
