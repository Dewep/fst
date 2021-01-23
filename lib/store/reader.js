const fs = require('./fs')
const { EventEmitter } = require('events')

class ReaderIterator {
  constructor (reader, position) {
    this._reader = reader
    this._rightPosition = position
    this._leftPosition = position
    this._size = 0
    this._buffer = Buffer.alloc(0)
  }

  get buffer () {
    return this._buffer
  }

  get size () {
    return this._rightPosition - this._leftPosition
  }

  async extend (size) {
    return size > 0 ? this.extendRight(size) : this.extendLeft(-size)
  }

  async extendLeft (size) {
    const buffer = await this._reader._read(this._leftPosition - size, size)
    this._buffer = Buffer.concat([buffer, this._buffer])
    this._leftPosition -= size
    return buffer
  }

  async extendRight (size) {
    const buffer = await this._reader._read(this._rightPosition, size)
    this._buffer = Buffer.concat([this._buffer, buffer])
    this._rightPosition += size
    return buffer
  }
}

class FSTStoreFileReader {
  constructor (path) {
    this._locked = false
    this._lockEE = new EventEmitter()

    this._path = path
    this._fd = null
    this._fstat = null
  }

  async init () {
    this._fd = await fs.open(this._path, 'r')
    this._fstat = await fs.fstat(this._fd)
  }

  get size () {
    return (this._fstat && this._fstat.size) || 0
  }

  async reader (position, size = null) {
    const reader = new ReaderIterator(this, position)
    if (size) {
      await reader.extend(size)
    }
    return reader
  }

  async _read (position, size, acceptSmaller = false) {
    await this._lock()

    if (position < 0) {
      throw new Error('Position cannot be negative')
    }
    if (position + size > this.size) {
      throw new Error('Read part position outside the ZIP file')
    }

    let buffer = Buffer.alloc(size)

    let bytesRead = 0
    while (bytesRead < size) {
      const read = await fs.read(this._fd, buffer, bytesRead, size - bytesRead, position + bytesRead)
      bytesRead += read.bytesRead

      if (acceptSmaller) {
        break
      }
    }

    if (bytesRead !== buffer.length) {
      buffer = buffer.slice(0, bytesRead)
    }

    await this._unlock()

    return buffer
  }

  async _lock () {
    if (!this._locked) {
      this._locked = true
      return
    }

    return new Promise(resolve => {
      const tryAcquire = async () => {
        if (!this._locked) {
          this._locked = true
          this._lockEE.removeListener('release', tryAcquire)
          return resolve()
        }
      }

      this._lockEE.on('release', tryAcquire)
    })
  }

  async _unlock () {
    this._locked = false
    setImmediate(() => this._lockEE.emit('release'))
  }
}

module.exports = FSTStoreFileReader
