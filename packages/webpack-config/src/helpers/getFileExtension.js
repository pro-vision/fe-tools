/**
 * Get the file extension from a filepath or filename.
 *
 * @param {string} file - filename or filepath
 * @returns {string} file extension
 */
function getFileExtension(file) {
  return file.split(".").reverse()[0];
}

export default getFileExtension;
