const BaseStructure = require('./base')
const FreePage = require('./free-page')
const OverflowPage = require('./overflow-page')
const SearchNodesPage = require('./search-nodes-page')
const SearchNodeRecordsPage = require('./search-node-records-page')
const RecordsNodesPages = require('./records-nodes-page')
const RecordNodePage = require('./record-node-page')

class Page extends BaseStructure {
  constructor (file, buffer) {
    super(file)

    this._buffer = buffer
    this._nextPage = null

    this.pageType = 0x00
    this.nextPageNumber = 0

    this.structure = null
  }

  get _format () {
    return [
      { key: 'pageType', type: 'uint', length: 1 },
      { key: 'nextPageNumber', type: 'uint', length: 4 }
    ]
  }

  static async load (file, buffer) {
    const page = new this(file, buffer)

    await page._parse(buffer)

    if (page.nextPageNumber) {
      page._nextPage = await page._file.page(page.nextPageNumber)
    }

    if (page.pageType === 0x00) {
      this.structure = new FreePage(file, page)
    } else if (page.pageType === 0x01) {
      this.structure = new OverflowPage(file, page)
    } else if (page.pageType === 0x10) {
      this.structure = new SearchNodesPage(file, page)
    } else if (page.pageType === 0x11) {
      this.structure = new SearchNodeRecordsPage(file, page)
    } else if (page.pageType === 0x30) {
      this.structure = new RecordsNodesPages(file, page)
    } else if (page.pageType === 0x31) {
      this.structure = new RecordNodePage(file, page)
    }

    if (!this.structure) {
      throw new Error('Invalid page type.')
    }

    const buffers = []
    let fullBufferLength = 0
    let pageIterator = page
    while (pageIterator) {
      buffers.push(pageIterator._buffer.slice(5)) // remove page information
      fullBufferLength += pageIterator._buffer.length - 5
      pageIterator = pageIterator._nextPage
    }
    const fullBuffer = buffers.length > 1 ? Buffer.concat(buffers, fullBufferLength) : buffers[0]

    await this.structure._parse(fullBuffer)
  }
}

module.exports = Page
