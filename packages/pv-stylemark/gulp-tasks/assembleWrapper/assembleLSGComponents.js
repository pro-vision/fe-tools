const { spawn } = require("cross-spawn");

const assembleLSGComponents = done => {
  spawn.sync(
    "node",
    [require.resolve("../lsg_tasks/assembleLSGComponents.js")],
    { stdio: "inherit" }
  );

  done();
};

module.exports = {
  assembleLSGComponents
};
