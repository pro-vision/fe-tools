var fs = require('fs');

module.exports= function(path, namespace, _, opt) {

  var files = fs.readdirSync(path);
  const icons = files.filter((filename) => filename.startsWith(namespace));
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