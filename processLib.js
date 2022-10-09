const fs = require('node:fs');
const pathNode = require('path')
const colors = require('colors')

const readDirectory = (path) => {
    // Chequeamos que la ruta exista
    const existRoute = fs.existsSync(path);
    // Si la ruta es diferente de vacío y verdadera procedemos con el flujo
    if (path !== '' && existRoute) {
        console.log('========== READING FOLDER ==========\n'.blue)
        // Un arreglo para agrupar todos los archivos .md del directorio
        const listFiles = [];
        try {
            // Iniciamos leyendo el directorio
            const files = fs.readdirSync(path);
            console.log('============ LIST FILES ============\n'.blue)
            // Recorremos para filtrar los archivos con extensión .md del directorio
            files.forEach(file => {
                if (pathNode.extname(file) === '.md') {
                    console.log('* ',file.magenta)
                    listFiles.push(file)
                }
            })
            // Devolvemos todos los archivos correspondientes
            return listFiles
        } catch (e) {
            console.log('Error read directory', e)
            return false;
        }
    } else {
        // Entregamos la ruta vacía o una ruta que no existe
        console.log('========= Not provide folder ========='.red)
        return false;
    }
}

/**
 * Funcion para extraer las urls de los archivos .md
 * @param files
 * @returns {*[]}
 */
const checkUrls = (files) => {
  const fileDescription = [];
  // Esto es una expresion regular para obtener todas las URLs
  const getUrlMd = /(((https?:\/\/)|(http?:\/\/)|(www\.))[^\s\n]+)(?=\))/g
  files.forEach(file => {
    const fileMd = fs.readFileSync(file, {encoding: "utf8", flag: "r"});
    const getAllUrls = fileMd.match(getUrlMd);
    fileDescription.push({
      name: file,
      urls: getAllUrls,
      quantity: getAllUrls.length
    })
  })
  return fileDescription;
}

/**
 * Función para validar las URLs
 * @param dataMd
 * @returns {Promise<Awaited<unknown>[]>}
 */
const verifyUrl = (dataMd) => {
  console.log('\n')
  console.log('============ FILES URLS ============\n'.blue)
  const info = dataMd.map((data) => {
    return data.urls.map((url) => {
      return fetch(url).then((res) => {
        return {
          file: data.name,
          href: url,
          status: res.status,
          ok: res.ok ? 'ok' : 'fail'
        }
      })
    })
  })
  return Promise.all(info.flat());
}
