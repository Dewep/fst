const util = require('util')
const fs = require('fs')

module.exports = {
  readFile: util.promisify(fs.readFile),
  writeFile: util.promisify(fs.writeFile)
}
