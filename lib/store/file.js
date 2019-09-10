const fs = require('./fs')
const MainHeader = require('./structures/main-header')

class FSTStoreFile {
  constructor (path) {
    this._path = path
    this._fd = null
    this._fstat = null

    this._mainHeader = new MainHeader(this)
    this._pages = {}
  }

  async init () {
    this._fd = await fs.open(this._path, 'r')
    this._fstat = await fs.fstat(this._fd)
  }

  async page (pageNumber) {
    if (!this._pages[pageNumber]) {
      // this._pages[pageNumber] =
    }
  }
}

module.exports = FSTStoreFile
