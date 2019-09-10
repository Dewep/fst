const util = require('util')
const fs = require('fs')

module.exports = {
  open: util.promisify(fs.open),
  fstat: util.promisify(fs.fstat),
  read: util.promisify(fs.read),
  write: util.promisify(fs.write),
  readFile: util.promisify(fs.readFile),
  writeFile: util.promisify(fs.writeFile)
}
