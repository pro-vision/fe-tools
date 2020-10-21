const fs = require("fs");

module.exports = function (path, namespace, _, opt) {
  const files = fs.readdirSync(path);
  const icons = files.filter((filename) => filename.startsWith(namespace));
  const iconIds = icons.map((icon) => {
    return {
      id: icon.replace(".svg", ""),
    };
  });

  let results = "";
  iconIds.forEach((item) => {
    results += opt.fn(item);
  });
  return results;
};
