#!/usr/bin/env node

const spawn = require('cross-spawn');
const args = process.argv.slice(2);

const scriptIndex = args.findIndex(
  x => x === 'prod' || x === 'dev'
);

// check if stats flag is not used in dev mode.
if (args.includes("dev") && (args.includes("--stats") || args.includes("--statsJson"))) {
  console.warn("PV_SCRIPTS: '--stats' & '--statsJson' flags should only be used in combination with prod build. To provide correct values and don't slow the development unnecessarily.");
}
// flags used to generate webpack-bundle-analyzer reports
if (args.includes("--stats")) process.env.PV_WEBPACK_STATS = "html";
if (args.includes("--statsJson")) process.env.PV_WEBPACK_STATS = "json";

const script = scriptIndex === -1 ? args[0] : args[scriptIndex];

const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];


if (scriptIndex !== -1) {
  const result = spawn.sync(
    'node',
    nodeArgs
      .concat(require.resolve('../scripts/' + script))
      .concat(args.slice(scriptIndex + 1)),
    { stdio: 'inherit' }
  );
  if (result.signal) {
    if (result.signal === 'SIGKILL') {
      console.log(
        'The build failed because the process exited too early. ' +
          'This probably means the system ran out of memory or someone called ' +
          '`kill -9` on the process.'
      );
    } else if (result.signal === 'SIGTERM') {
      console.log(
        'The build failed because the process exited too early. ' +
          'Someone might have called `kill` or `killall`, or the system could ' +
          'be shutting down.'
      );
    }
    process.exit(1);
  }
  process.exit(result.status);
}