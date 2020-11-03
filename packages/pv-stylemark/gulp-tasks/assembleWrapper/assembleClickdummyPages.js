const { fork } = require("child_process");

const assembleClickdummyPages = (done) => {

  fork(require.resolve("../clickdummy_tasks/assembleClickdummyPages.js"), [], {
    stdio: "inherit"
  }).on("exit", () => {
    done();
  });
};

module.exports = {
  assembleClickdummyPages,
};
