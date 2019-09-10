const path = require('path')
const fs = require('./fs')

class FSTStore {
  constructor (indice, config, options = {}) {
    this.indice = indice
    this.config = config
    this.options = options

    this.config.fieldsList = Object.keys(this.config.fields)

    const storageRootDirectory = this.options.storageRootDirectory || path.join(__dirname, '..', '..', 'indexes')
    this.paths = {
      nodes: path.join(storageRootDirectory, `${this.indice}.nodes.json`),
      records: path.join(storageRootDirectory, `${this.indice}.records.json`),
      facets: path.join(storageRootDirectory, `${this.indice}.facets.json`)
    }

    this.nodes = null
    this.records = null
    this.facets = null
  }

  async init () {
    try {
      this.nodes = JSON.parse(await fs.readFile(this.paths.nodes))
      this.records = JSON.parse(await fs.readFile(this.paths.records))
      this.facets = JSON.parse(await fs.readFile(this.paths.facets))
    } catch (err) {
      this.nodes = { children: [] }
      this.records = {}
      this.facets = {}

      for (const field of this.config.fieldsList) {
        if (this.config.fields[field].facets) {
          this.facets[field] = {}
        }
      }
    }

    return this
  }

  static async load (indice, config, options = {}) {
    const store = new this(indice, config, options)
    return store.init()
  }

  async save () {
    await fs.writeFile(this.paths.nodes, JSON.stringify(this.nodes))
    await fs.writeFile(this.paths.records, JSON.stringify(this.records))
    await fs.writeFile(this.paths.facets, JSON.stringify(this.facets))
  }
}

module.exports = FSTStore
