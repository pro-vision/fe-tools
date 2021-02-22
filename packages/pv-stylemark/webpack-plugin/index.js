const Assemble = require("@pro-vision/assemble-lite/Assemble");

const buildStylemark = require("../scripts/buildStylemarkLsg");
const { getFilesToWatch, fileGlobes } = require("./getFilesToWatch");
const { resolveApp, getAppConfig, join } = require("../helper/paths");

const { destPath, componentsSrc } = getAppConfig();
class PvStylemarkPlugin {
  constructor() {
    // list of files currently being watched which need a re-compile of assemble or stylemark when modified
    this.watchedFiles = { lsgFiles: [], assembleFiles: [] };
    // is false during watch mode and when re-compiling because some files have been changed
    this.firstRun = true;
    this.assemble = new Assemble();
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
          .filter((filePath) => this.watchedFiles.lsgFiles.includes(filePath))
          // new files
          .concat(
            filesToWatch.lsgFiles.filter(
              (filePath) => !this.watchedFiles.lsgFiles.includes(filePath)
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
        // only needs build on the first run and when stylemark or assemble files have been changed
        const buildLsg = buildAssemble || copyStylemarkFiles;

        if (buildAssemble) {
          await this.assemble.build(
            {
              baseDir: resolveApp(componentsSrc),
              components: resolveApp(fileGlobes.assembleFiles.components),
              pages: resolveApp(fileGlobes.assembleFiles.pages),
              data: fileGlobes.assembleFiles.data.map(resolveApp),
              helpers: resolveApp(fileGlobes.assembleFiles.helpers),
              layouts: resolveApp(fileGlobes.assembleFiles.layouts),
              lsgLayouts: resolveApp(fileGlobes.assembleFiles.lsgLayouts),
              componentsTargetDirectory: resolveApp(
                join(destPath, "components")
              ),
              pagesTargetDirectory: resolveApp(join(destPath, "pages")),
              lsgComponentsTargetDirectory: resolveApp(
                join(destPath, "/lsg_components")
              ),
            },
            this.firstRun ? null : changedAssembleFiles
          );
        }

        if (buildLsg) {
          await buildStylemark({
            // unless files were changed but none was a static stylemark file
            shouldCopyStyleguideFiles: copyStylemarkFiles,
            // unless files were changed but none was an assemble file
            shouldAssemble: false,
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
