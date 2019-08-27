const { spawn } = require('cross-spawn');

const assembleLSGComponents = (done) => {

  const result = spawn.sync(
    'node',
    [require.resolve('../../scripts/assembleLSGComponents.js')],
    { stdio: 'inherit' }
  );

  if (result.signal) {
    done();
    process.exit(1);
  }

  done();  
};

module.exports = {
  assembleLSGComponents
};