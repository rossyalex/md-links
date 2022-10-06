const argv = require('yargs')
    .scriptName("Lector-MD Rossy")
    .options('path', {
      alias: 'p',
      type: 'string',
      default: '',
      description: 'Path of all files .md'
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

console.log(path, options)
