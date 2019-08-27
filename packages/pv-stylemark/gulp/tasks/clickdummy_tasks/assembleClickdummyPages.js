const { spawn } = require('cross-spawn');

const assembleClickdummyPages = (done) => {

  const result = spawn.sync(
    'node',
    [require.resolve('../../scripts/assembleClickdummyPages.js')],
    { stdio: 'inherit' }
  );

  if (result.signal) {
    done();
    process.exit(1);
  }

  done();  
};

module.exports = {
  assembleClickdummyPages
};