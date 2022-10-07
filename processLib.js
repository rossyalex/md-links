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