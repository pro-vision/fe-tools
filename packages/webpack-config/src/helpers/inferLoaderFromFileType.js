import getFileExtension from "./getFileExtension";

/**
 * Will change some default configuration by inferring filetypes.
 *
 * @param {object} config - pv.config
 * @returns {object} config object
 *
 * @example
```
 // pv.config.js
 ...
 jsEntry: "src/index.tsx"
 ...
```
 Will cause that the final config sets useTS and useReact automatically
 to true:
```
 {
 jsEntry: "src/index.tsx"
 useTS: true,
 useReact: true
 }
```
 */
function inferLoaderFromFileType(config) {
  let newConfigEntries = {};

  const fileTypeMapping = {
    ts: {
      useTS: true
    },
    tsx: {
      useReact: true,
      useTS: true
    },
    jsx: {
      useReact: true,
      useTS: false
    },
    js: {
      useTS: false
    }
  };

  const fileExtension = getFileExtension(config.jsEntry);

  if (fileTypeMapping.hasOwnProperty(fileExtension)) {
    newConfigEntries = fileTypeMapping[fileExtension];
  }

  return { ...config, ...newConfigEntries };
}

export default inferLoaderFromFileType;
