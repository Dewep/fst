const BaseStructure = require('./base')

class SearchNodesPages extends BaseStructure {
  constructor (file) {
    super(file)

    this.numberOfNodes = 0
    this.nodes = []
  }

  get _format () {
    return [
      { key: 'numberOfNodes', type: 'uint', length: 1 },
      {
        key: 'nodes',
        array: [
          { key: 'valueLength', type: 'uint', length: 1 },
          { key: 'childPageNumber', type: 'uint', length: 4 },
          { key: 'searchNodeRecordsPageNumber', type: 'uint', length: 4 },
          { key: 'value', type: 'utf8', length: 'valueLength' }
        ],
        length: 'numberOfNodes'
      }
    ]
  }

  async _preBuffer () {
    this.numberOfNodes = this.nodes.length
  }
}

module.exports = SearchNodesPages
