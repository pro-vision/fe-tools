const { fork } = require("child_process");

const assembleLSGComponents = (done) => {
  fork(require.resolve("../lsg_tasks/assembleLSGComponents.js"), [], {
    stdio: "inherit",
  }).on("exit", () => {
    done();
  });
};

module.exports = {
  assembleLSGComponents,
};
