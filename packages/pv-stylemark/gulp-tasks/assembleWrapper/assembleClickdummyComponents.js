const { spawn } = require("cross-spawn");

const assembleClickdummyComponents = (done) => {
  spawn.sync(
    "node",
    [require.resolve("../clickdummy_tasks/assembleClickdummyComponents.js")],
    { stdio: "inherit" }
  );

  done();
};

module.exports = {
  assembleClickdummyComponents,
};
