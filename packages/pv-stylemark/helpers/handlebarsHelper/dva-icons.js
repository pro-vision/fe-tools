var fs = require('fs');

module.exports['dva-icons'] = function(ignore, opt) {

  var files = fs.readdirSync('src/assets/icons/');
  const icons = files.filter((filename) => filename.startsWith('dva-icon'));
  const iconIds = icons.map((icon) => {
    return {
      id: icon.replace('.svg', '')
    }
  });

  var results = '';
  iconIds.forEach( (item) => {
    results += opt.fn(item);
  });
  return results;
};