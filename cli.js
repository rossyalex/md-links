const {readDirectory, checkUrls, verifyUrl, statsUrl, notVerifyUrl} = require("./processLib");
const argv = require('yargs')
  .scriptName("Lector-MD Rossy")
  .options('path', {
    alias: 'p',
    type: 'string',
    default: '',
    description: 'Stats and validate urls in files'
  })
  .options('options', {
    alias: 'o',
    type: 'array',
    default: [],
    description: 'Stats and validate urls in files'
  })
  .help()
  .argv

const { path, options } = argv;

const lectorMd = (path, options) => {
  let [validate, stats] = options;
  if (validate === 'stats') {
    validate = false
    stats = true
  }
  console.log(validate, stats)
  const directory = readDirectory(path);
  if (!directory) {
    console.log('Ruta no existe o no se ingresó'.red);
  }
  const checkFiles = checkUrls(path, directory);
  if (checkFiles.length > 0) {
    // Si validate y stats son solicitados
    if (validate && stats) {
      return [verifyUrl(checkFiles)
        .then((r) => console.log(r.map(d => d.value)))
        .catch(e => console.log('Error URL not enable', e)),
        statsUrl(checkFiles)]
      // Si solamente pedimos validate
    } else if(validate && !stats) {
      return verifyUrl(checkFiles)
        .then((r) => console.log(r))
        .catch((e) => {
          console.error(e)
        })
        .finally(() => console.log('Proceso finalizado'))
      // Si solamente solitamos los stats
    } else if(!validate && stats) {
      return [notVerifyUrl(checkFiles), statsUrl(checkFiles)]
      // Si no queremos validate ni stats
    } else if(!validate && !stats) {
      const result = notVerifyUrl(checkFiles)
      console.log(result)
    }
  }
}

lectorMd(path, options)
