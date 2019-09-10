const buildStylemark = require("../scripts/buildStylemarkLsg");
const { getFilesToWatch } = require("./getFilesToWatch");

class PvStylemarkPlugin {
  apply(compiler) {

    compiler.hooks.emit.tapPromise(
      "PvStylemarkPlugin",
      () => buildStylemark()
    );

    compiler.hooks.afterCompile.tapAsync(
      "PvStylemarkPlugin",
      (compilation, callback) => {
        getFilesToWatch()
          .then(files => {

            if (Array.isArray(compilation.fileDependencies)) {
              compilation.fileDependencies.push(...files);
            }
            else {
              files.forEach(file => compilation.fileDependencies.add(file));
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