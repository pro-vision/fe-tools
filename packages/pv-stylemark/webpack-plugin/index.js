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
        const allFiles = Object.values(filesToWatch).reduce(
          (acc, val) => acc.concat(val),
          []
        );
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

        // only needs build on the first run and when assemble files have been changed
        const buildAssemble = this.firstRun || changedAssembleFiles.length;
        const copyStylemarkFiles =
          this.firstRun || changedStylemarkFiles.length;

        await buildStylemark({
          shouldCopyStyleguideFiles: copyStylemarkFiles,
          shouldAssemble: buildAssemble,
        });

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
