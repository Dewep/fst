const BaseStructure = require('./base')

class SearchNodeRecordsPage extends BaseStructure {
  constructor (file) {
    super(file)

    this.numberOfRecords = 0
    this.bufferLength = 0
    this.recordsBuffer = Buffer.alloc(0)

    this.records = []
  }

  get _format () {
    return [
      { key: 'numberOfRecords', type: 'uint', length: 4 },
      { key: 'bufferLength', type: 'uint', length: 4 },
      { key: 'recordsBuffer', type: 'deflate', length: 'bufferLength' }
    ]
  }

  async _postParse () {
    this.records = this.recordsBuffer.toString('utf8').split('\x00')
  }

  async _preBuffer () {
    this.numberOfRecords = this.records.length
    this.recordsBuffer = Buffer.from(this.records.join('\x00'))
    this.bufferLength = this.recordsBuffer.length
  }
}

module.exports = SearchNodeRecordsPage
