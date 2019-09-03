const FSTStore = require('./store')

class FST {
  constructor (options = {}) {
    this.options = options

    this.store = {}
  }

  async init (indexes) {
    for (const indice of Object.keys(indexes)) {
      this.store[indice] = await FSTStore.load(indice, indexes[indice], this.options)
    }

    return this
  }

  static async load (indexes, options = {}) {
    const fst = new this(options)
    return fst.init(indexes)
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

  async _insertRecord (indice, record) {
    this.store[indice].records[record.slug] = record

    for (const field of this.store[indice].config.fieldsList) {
      const fieldConfig = this.store[indice].config.fields[field]
      const value = record[field]

      if (!fieldConfig.facets && fieldConfig.searchable !== 'string') {
        continue
      }

      if (typeof value !== 'string') {
        continue
      }

      const deburrValue = this._deburr(value)

      if (fieldConfig.facets) {
        if (!this.store[indice].facets[field][deburrValue]) {
          this.store[indice].facets[field][deburrValue] = []
        }
        this.store[indice].facets[field][deburrValue].push(record.slug)
      }

      if (fieldConfig.searchable === 'string') {
        const words = this._splitWords(deburrValue)
        for (const word of words) {
          await this._indexWord(this.store[indice].nodes.children, word, record.slug)
        }
      }
    }
  }

  async insertRecord (indice, record) {
    await this._insertRecord(indice, record)
    await this.store[indice].save()
  }

  async insertRecords (indice, records) {
    for (const record of records) {
      await this._insertRecord(indice, record)
    }
    await this.store[indice].save()
  }

  // QUERY

  async _getAllChildRecords (child) {
    const records = [...child.records]
    for (const subChild of child.children) {
      records.push(...await this._getAllChildRecords(subChild))
    }
    return records
  }

  async _searchWord (children, query) {
    const records = []

    for (const child of children) {
      if (child.value === query) {
        records.push({ weight: 1, slugs: child.records })
      }

      if (query.startsWith(child.value)) {
        const childRecords = await this._searchWord(child.children, query.slice(child.value.length))
        records.push(...childRecords)
      }

      if (child.value.startsWith(query)) {
        records.push({ weight: 0.5, slugs: await this._getAllChildRecords(child) })
      }
    }

    return records
  }

  async search (indice, filters, query) {
    const words = this._splitWords(this._deburr(query))

    const records = []
    for (const word of words) {
      const results = await this._searchWord(this.store[indice].nodes.children, word)
      for (const result of results) {
        for (const slug of result.slugs) {
          const record = records.find(r => r.slug === slug)
          if (!record) {
            records.push({ weight: result.weight, slug })
          } else {
            record.weight += result.weight
          }
        }
      }
    }

    return records
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 10)
      .map(result => {
        return {
          weight: result.weight,
          record: this.store[indice].records[result.slug]
        }
      })
  }
}

module.exports = FST
