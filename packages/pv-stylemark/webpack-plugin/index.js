const buildStylemark = require("../scripts/buildStylemarkLsg");
const { getFilesToWatch } = require("./getFilesToWatch");

class PvStylemarkPlugin {
  constructor() {
    this.startTime = Date.now();
    this.prevTimestamps = new Map();
    this.watchedFiles = { staticStylemarkFiles: [], assembleFiles: [] };
  }
  apply(compiler) {
    compiler.hooks.emit.tapPromise("PvStylemarkPlugin", (compilation) => {
      const changedFiles = Array.from(compilation.fileTimestamps.keys()).filter(
        (watchfile) => {
          return (
            (this.prevTimestamps.get(watchfile) || this.startTime) <
            (compilation.fileTimestamps.get(watchfile) || Infinity)
          );
        }
      );

      const changedStylemarkFiles = changedFiles.filter((filePath) =>
        this.watchedFiles.staticStylemarkFiles.includes(filePath)
      );
      const changedAssembleFiles = changedFiles.filter((filePath) =>
        this.watchedFiles.assembleFiles.includes(filePath)
      );

      this.prevTimestamps = compilation.fileTimestamps;

      // called during watch change, but the change wasn't in any relevant files
      if (
        changedFiles.length &&
        !changedStylemarkFiles.length &&
        !changedAssembleFiles.length
      ) {
        return Promise.resolve();
      }

      return buildStylemark({
        // unless files were changed but none was a static stylemark file
        shouldCopyStyleguideFiles:
          !changedFiles.length || changedStylemarkFiles.length,
        // unless files were changed but none was a assemble file
        shouldAssemble: !changedFiles.length || changedAssembleFiles.length,
      });
    });

    compiler.hooks.afterCompile.tapAsync(
      "PvStylemarkPlugin",
      (compilation, callback) => {
        getFilesToWatch().then((filesToWatch) => {
          const files = Object.values(filesToWatch).flat();
          // memorize stylemark relevant files to compare during emit phase
          this.watchedFiles = filesToWatch;

          if (Array.isArray(compilation.fileDependencies)) {
            compilation.fileDependencies.push(...files);
          } else {
            files.forEach((file) => compilation.fileDependencies.add(file));
          }
          callback();
        });
      }
    );
  }
}

module.exports = {
  PvStylemarkPlugin,
};
