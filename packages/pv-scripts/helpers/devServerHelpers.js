const chalk = require("chalk");
const clearConsole = require("react-dev-utils/clearConsole");

const { autoConsoleClearEnabled } = require("./buildConfigHelpers");
const formatWebpackMessages = require("./formatWebpackMessages");

const isInteractive = process.stdout.isTTY && autoConsoleClearEnabled();

function getCompiler({ webpackConfig, webpack }) {
  // 'Compiler' is a low-level interface to Webpack.
  // It lets us listen to some events and provide our own custom messages.

  let compiler;

  try {
    compiler = webpack(webpackConfig);
  } catch (err) {
    console.log(chalk.red("Failed to compile."));
    console.log();
    console.log(err.message || err);
    console.log();
    process.exit(1);
  }

  // 'invalid' event fires when you have changed a file, and Webpack is
  // recompiling a bundle. WebpackDevServer takes care to pause serving the
  // bundle, so if you refresh, it'll wait instead of serving the old one.
  // 'invalid' is short for 'bundle invalidated', it doesn't imply any errors.
  compiler.hooks.invalid.tap("invalid", () => {
    if (isInteractive) {
      clearConsole();
    }
    console.log("Compiling...");
  });

  // 'done' event fires when Webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.hooks.done.tap("done", (stats) => {
    if (isInteractive) {
      clearConsole();
    }

    const statsData = stats.toJson({
      all: false,
      warnings: true,
      errors: true,
    });

    const messages = formatWebpackMessages(statsData);
    const isSuccessful = !messages.errors.length && !messages.warnings.length;
    if (isSuccessful) {
      console.log(chalk.green("Compiled successfully!"));
    }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      // Only keep the first error. Others are often indicative
      // of the same problem, but confuse the reader with noise.
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }
      console.log(chalk.red("Failed to compile.\n"));
      console.log(messages.errors.join("\n\n"));
      return;
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      console.log(chalk.yellow("Compiled with warnings.\n"));
      console.log(messages.warnings.join("\n\n"));
    }
  });

  return compiler;
}

module.exports = {
  getCompiler,
};
