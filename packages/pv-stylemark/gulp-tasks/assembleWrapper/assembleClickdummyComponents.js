const { fork } = require("child_process");

const assembleClickdummyComponents = (done) => {
  fork(
    require.resolve("../clickdummy_tasks/assembleClickdummyComponents.js"),
    [],
    { stdio: "inherit" }
  ).on("exit", () => {
    done();
  });
};

module.exports = {
  assembleClickdummyComponents,
};
