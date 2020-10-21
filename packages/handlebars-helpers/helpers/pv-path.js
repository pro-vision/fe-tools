module.exports = function(rootContext, path) {
  let nestedPath = "";
  let pathPrefix = "";

  if (path !== undefined && path.startsWith("http")) return path;

  if (rootContext.default !== undefined) {
    pathPrefix = rootContext.default.pathPrefix;
  }

  if (rootContext.nestedPath !== undefined) {
    nestedPath = rootContext.nestedPath;
  }
  return pathPrefix + nestedPath + path;
};
