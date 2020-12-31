const buildStylemark = require("../scripts/buildStylemarkLsg");
const { getFilesToWatch } = require("./getFilesToWatch");

class PvStylemarkPlugin {
  constructor() {
    this.startTime = Date.now();
    this.prevTimestamps = new Map();
    this.watchedFiles = { staticStylemarkFiles: [], assembleFiles: [] };
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      "PvStylemarkPlugin",
      async (compilation, callback) => {
        // add files for stylemark and assemble to webpack to watch
        const filesToWatch = await getFilesToWatch();
        const allFiles = Object.values(filesToWatch).flat();
        if (Array.isArray(compilation.fileDependencies)) {
          compilation.fileDependencies.push(...allFiles);
        } else {
          allFiles.forEach((file) => compilation.fileDependencies.add(file));
        }

        const changedFiles = Array.from(
          compilation.fileTimestamps.keys()
        ).filter((watchfile) => {
          return (
            (this.prevTimestamps.get(watchfile) || this.startTime) <
            (compilation.fileTimestamps.get(watchfile) || Infinity)
          );
        });

        // memorize stylemark relevant files to compare during emit phase
        this.watchedFiles = filesToWatch;

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
          callback();
          return;
        }

        await buildStylemark({
          // unless files were changed but none was a static stylemark file
          shouldCopyStyleguideFiles:
            !changedFiles.length || changedStylemarkFiles.length,
          // unless files were changed but none was a assemble file
          shouldAssemble: !changedFiles.length || changedAssembleFiles.length,
        });

        callback();
      }
    );
  }
}

module.exports = {
  PvStylemarkPlugin,
};
