class FST {
  // INIT

  constructor (config) {
    this.config = config

    this.nodes = {}
    this.records = {}
    this.facets = {}
  }

  async init () {
    return this
  }

  static async load (config) {
    const fst = new this(config)
    return fst.init()
  }

  debug () {
    console.log({
      nodes: JSON.stringify(this.nodes),
      record: JSON.stringify(this.records),
      facets: JSON.stringify(this.facets)
    })
  }

  // CONFIG

  _getIndice (indice) {
    const cfg = this.config.indexes[indice]
    if (!cfg.initialized) {
      cfg.fieldsList = Object.keys(cfg.fields)
      this.nodes[indice] = { children: [] }
      this.records[indice] = {}
      this.facets[indice] = {}
      for (const field of cfg.fieldsList) {
        this.facets[indice][field] = {}
      }
      cfg.initialized = true
    }
    return cfg
  }

  // PIPELINE

  _splitWords (content) {
    return content.split(' ').filter(w => w) // @TODO: unique
  }

  _deburr (content) {
    return content.normalize('NFD').toLowerCase()
  }

  // INSERT/UPDATE/DELETE

  async _indexWord (children, word, slug) {
    for (const child of children) {
      if (child.value[0] === word[0]) {
        if (child.value === word) {
          if (!child.records.includes(slug)) {
            child.records.push(slug)
          }
          return
        }

        if (word.startsWith(child.value)) {
          return this._indexWord(child.children, word.slice(child.value.length), slug)
        }

        let same = 1
        while (child.value[same] === word[same]) {
          same += 1
        }
        child.children = [
          {
            value: child.value.slice(same),
            records: child.records,
            children: child.children
          },
          {
            value: word.slice(same),
            records: [slug],
            children: []
          }
        ]
        child.value = word.slice(0, same)
        child.records = []
        return
      }
    }

    children.push({
      value: word,
      records: [slug],
      children: []
    })
  }

  async insertRecord (indice, record) {
    const cfg = this._getIndice(indice)

    this.records[indice][record.slug] = record

    for (const field of cfg.fieldsList) {
      const value = record[field]
      const deburrValue = this._deburr(value)
      if (!this.facets[indice][field][deburrValue]) {
        this.facets[indice][field][deburrValue] = []
      }
      this.facets[indice][field][deburrValue].push(record.slug)

      const words = this._splitWords(deburrValue)
      for (const word of words) {
        await this._indexWord(this.nodes[indice].children, word, record.slug)
      }
    }
  }

  // QUERY

  async search (indice, filters, query) {
    return []
  }
}

module.exports = FST
