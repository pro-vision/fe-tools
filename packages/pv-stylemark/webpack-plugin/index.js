const buildStylemark = require("../scripts/buildStylemarkLsg");
const { getFilesToWatch } = require("./getFilesToWatch");

class PvStylemarkPlugin {
  constructor() {
    // list of files currently being watched which need a re-compile of assemble or stylemark when modified
    this.watchedFiles = { staticStylemarkFiles: [], assembleFiles: [] };
    // is false during watch mode and when re-compiling because some files have been changed
    this.firstRun = true;
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      "PvStylemarkPlugin",
      async (compilation, callback) => {
        // add files for stylemark and assemble to webpack to watch
        const filesToWatch = await getFilesToWatch();
        const allFiles = Object.values(filesToWatch).flat();
        allFiles.forEach((file) => compilation.fileDependencies.add(file));

        const changedFiles = this.firstRun
          ? []
          : [...compiler.modifiedFiles, ...compiler.removedFiles];

        const changedStylemarkFiles = changedFiles
          // modified / removed files
          .filter((filePath) =>
            this.watchedFiles.staticStylemarkFiles.includes(filePath)
          )
          // new files
          .concat(
            filesToWatch.staticStylemarkFiles.filter(
              (filePath) =>
                !this.watchedFiles.staticStylemarkFiles.includes(filePath)
            )
          );
        const changedAssembleFiles = changedFiles
          // modified / removed files
          .filter((filePath) =>
            this.watchedFiles.assembleFiles.includes(filePath)
          )
          // new files
          .concat(
            filesToWatch.assembleFiles.filter(
              (filePath) => !this.watchedFiles.assembleFiles.includes(filePath)
            )
          );

        // memorize stylemark relevant files to compare during next emit phase
        this.watchedFiles = filesToWatch;

        // only needs build on the first run and when stylemark or assemble files have been changed
        if (
          this.firstRun ||
          changedStylemarkFiles.length ||
          changedAssembleFiles.length
        ) {
          await buildStylemark({
            // unless files were changed but none was a static stylemark file
            shouldCopyStyleguideFiles:
              this.firstRun || changedStylemarkFiles.length,
            // unless files were changed but none was a assemble file
            shouldAssemble: this.firstRun || changedAssembleFiles.length,
          });
        }

         // for the next iteration
        this.firstRun = false;

        callback();
      }
    );
  }
}

module.exports = {
  PvStylemarkPlugin,
};
