const BaseStructure = require('./base')

const magicNumber = '://dewep.net/fst 1.0\n\x00'

class MainHeader extends BaseStructure {
  constructor (file) {
    super(file)

    this.magicNumber = magicNumber
    this.numberOfPages = 0
    this.rootPageSearchNodes = 0
    this.rootPageRecordsNodes = 0
    this.pageFacetsNodes = 0
    this.numberOfFreePages = 0
    this.pageNumberOfFirstFreePage = 0
  }

  get _format () {
    return [
      { key: 'magicNumber', type: 'utf8', length: 22, assert: magicNumber },
      { key: 'numberOfPages', type: 'uint', length: 4 },
      { key: 'rootPageSearchNodes', type: 'uint', length: 4 },
      { key: 'rootPageRecordsNodes', type: 'uint', length: 4 },
      { key: 'pageFacetsNodes', type: 'uint', length: 4 },
      { key: 'numberOfFreePages', type: 'uint', length: 4 },
      { key: 'pageNumberOfFirstFreePage', type: 'uint', length: 4 }
    ]
  }
}

module.exports = MainHeader
