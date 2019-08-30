const { spawn } = require("cross-spawn");

const assembleClickdummyComponents = done => {

  const result = spawn.sync(
    "node",
    [require.resolve("../../scripts/assembleClickdummyComponents.js")],
    { stdio: "inherit" }
  );

  if (result.signal) {
    done();
    process.exit(1);
  }

  done();
};

module.exports = {
  assembleClickdummyComponents
};