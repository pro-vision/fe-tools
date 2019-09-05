const { spawn } = require("cross-spawn");

const assembleClickdummyPages = done => {
  spawn.sync("node", [
    require.resolve("../clickdummy_tasks/assembleClickdummyPages.js")
  ], { stdio: "inherit" });

  done();
};

module.exports = {
  assembleClickdummyPages
};