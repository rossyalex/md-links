const { readDirectory, checkUrls, verifyUrl, notVerifyUrl, statsUrl} = require('./processLib')

/**
 * Function API js
 * @param {string} path
 * @param {object} options
 * @return {Promise<unknown>}
 */
const lectorMd = (path, options = {}) => {
  const { validate = false, stats = false } = options;
  return new Promise((resolve, reject) => {
    const directory = readDirectory(path);
    if (!directory) {
      reject('Ruta no existe o no se ingresó');
    }
    const checkFiles = checkUrls(directory);
    if (checkFiles.length > 0) {
      if (validate && stats) {
        resolve([verifyUrl(checkFiles).then((r) => console.log(r)), statsUrl(checkFiles)])
      } else if(validate && !stats) {
        resolve(verifyUrl(checkFiles))
      } else if(!validate && stats) {
        resolve([notVerifyUrl(checkFiles), statsUrl(checkFiles)])
      } else if(!validate && !stats) {
        resolve(notVerifyUrl(checkFiles))
      }
    }
  })
}

module.exports = {
    lectorMd
}
