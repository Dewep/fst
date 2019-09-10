const BaseStructure = require('./base')

class FreePage extends BaseStructure {
  constructor (file, page) {
    super(file)

    this._page = page
  }

  get _format () {
    return []
  }
}

module.exports = FreePage
