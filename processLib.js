const fs = require('node:fs');
const pathNode = require('path')
const fetch = require('node-fetch')
const colors = require('colors')

/**
 * Funcion para leer un directorio
 * @param path
 * @returns {boolean|*[]}
 */
const readDirectory = (path) => {
    // Chequeamos que la ruta exista
    const existRoute = fs.existsSync(path);
    // Si la ruta es diferente de vacío y verdadera procedemos con el flujo
    if (path !== '' && existRoute) {
        console.log('========== READING FOLDER ==========\n'.blue)
        // Un arreglo para agrupar todos los archivos .md del directorio
        const listFiles = [];
        try {
          if (fs.lstatSync(path).isDirectory()) {
            // Iniciamos leyendo el directorio
            const files = fs.readdirSync(path);
            console.log('============ LIST FILES ============\n'.blue)
            // Recorremos para filtrar los archivos con extensión .md del directorio
            files.forEach(file => {
              if (pathNode.extname(file) === '.md') {
                console.log('* ', file.magenta)
                listFiles.push(file)
              }
            })
            // Devolvemos todos los archivos correspondientes
            return listFiles
          } else {
            // Si entra acá es que no estamos con un directorio sino directamente con un archivo
            const file = pathNode.basename(path);
            console.log('============ LIST FILES ============\n'.blue)
            console.log('* ',file.magenta)
            return [file]
          }
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
  // Recorremos cada archivo para leer y obtener sus links (Si es que tiene)
  files.forEach(file => {
    // Almacenamos el resultado del archivo que nos devuelve un string del archivo
    const fileMd = fs.readFileSync(file, {encoding: "utf8", flag: "r"});
    // Obtenemos mediante la expresión regular los links
    const getAllUrls = fileMd.match(getUrlMd);
    // Ingresamos dentro de un arreglo un objeto con name, urls y la cantidad de links
    fileDescription.push({
      name: file,
      urls: getAllUrls, // Esto es un arreglo de links
    })
  })
  // Retornamos un arreglo de objetos con la información por archivo
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
  // Recorremos cada archivo y su grupo de links para ver si las urls son validas
  const info = dataMd.map((data) => {
    return data.urls.map((url) => {
      // Generamos una promesa con fetch para validar los links
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
  // Generamos una promesa con fetch para validar los links
  return Promise.all(info.flat());
}

/**
 * Función que solo devuelve lo necesario sin validar las URLs
 * @param dataMd
 * @returns []
 */
const notVerifyUrl = (dataMd) => {
  console.log('\n')
  console.log('============ FILES URLS ============\n'.blue)
  // Retornamos un arreglo de links pero sin validar si son válidos
  const notVerify = dataMd.map((data) => {
    return data.urls.map((url) => {
      return {
        file: data.name,
        href: url,
      }
    })
  });
  console.log(notVerify);
  return notVerify;
}

/**
 * Función para retornar la cantidad de links y links únicos
 * @param dataMd
 * @returns {*}
 */
const statsUrl = (dataMd) => {
  // Retornamos el arreglo modificado con total y unicos
  const stats = dataMd.map(data => {
    return {
      total: data.urls.length,
      unique: [...new Set(data.urls)].length
    }
  })
  console.log(stats);
  return stats;
}

// Exportamos cada una de las funciones
// Son llamadas tanto por el CLI como por la API
module.exports = {
  readDirectory,
  checkUrls,
  verifyUrl,
  notVerifyUrl,
  statsUrl
}
