class BaseStructure {
  constructor (file) {
    this._file = file
  }

  get _format () {
    throw new Error('Method must be implemented.')
  }

  async _postParse () {}

  async _preBuffer () {}

  async _parse (buffer) {
    let offset = 0

    for (const key of Object.keys(this._format)) {
      if (this._format[key].type === 'utf8') {
        this[key] = buffer.toString('utf8')
      } else if (this._format[key].type === 'uint') {
        this[key] = buffer.readUIntBE(offset, this._format[key].length)
      } else if (this._format[key].type === 'int') {
        this[key] = buffer.readIntBE(offset, this._format[key].length)
      } else {
        throw new Error(`Unknow structure type "${this._format[key].type}".`)
      }

      if (this._format[key].assert !== undefined && this._format[key].assert !== this[key]) {
        throw new Error(`Bad value for key "${key}".`)
      }

      offset += this._format[key].length
    }

    await this._postParse()
  }

  get _length () {
    let length = 0
    for (const key of Object.keys(this._format)) {
      length += this._format[key].length
    }
    return length
  }

  async _toBuffer () {
    // const buffer = Buffer.alloc(this._length)
    // let offset = 0

    // for (const key of Object.keys(this._format)) {
    //   if (this._format[key].type === 'utf8') {
    //     this[key] = buffer.toString('utf8')
    //   } else if (this._format[key].type === 'uint') {
    //     this[key] = buffer.readUIntBE(offset, this._format[key].length)
    //   } else if (this._format[key].type === 'int') {
    //     this[key] = buffer.readIntBE(offset, this._format[key].length)
    //   } else {
    //     throw new Error('Unknow structure type ' + this._format[key].type)
    //   }

    //   offset += this._format[key].length
    // }
  }
}

module.exports = BaseStructure
