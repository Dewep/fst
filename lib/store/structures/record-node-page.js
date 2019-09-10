const BaseStructure = require('./base')

class RecordNodePage extends BaseStructure {
  constructor (file) {
    super(file)

    this.bufferLength = 0
    this.recordBuffer = Buffer.alloc(0)

    this.record = null
  }

  get _format () {
    return [
      { key: 'bufferLength', type: 'uint', length: 4 },
      { key: 'recordBuffer', type: 'deflate', length: 'bufferLength' }
    ]
  }

  async _postParse () {
    this.record = JSON.parse(this.recordBuffer.toString('utf8'))
  }

  async _preBuffer () {
    this.recordBuffer = Buffer.from(JSON.stringify(this.record))
    this.bufferLength = this.recordBuffer.length
  }
}

module.exports = RecordNodePage
