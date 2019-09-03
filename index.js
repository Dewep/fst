const FST = require('./lib/fst')
// const patients = require('./patients')
const readline = require('readline')

async function main () {
  console.time('fst loaded')
  const fst = await FST.load({
    patient: {
      fields: {
        slug: {},
        lastname: {
          searchable: 'string'
        },
        firstname: {
          searchable: 'string'
        },
        stayNumber: {
          searchable: 'string'
        },
        isActive: {
          // facets: true,
          // searchable: 'boolean'
        },
        typeDeVenue: {
          facets: true,
          searchable: 'string'
        },
        uniteDHebergement: {
          facets: true,
          searchable: 'string'
        },
        lit: {
          searchable: 'string'
        },
        doctorRpps: {
          facets: true,
          searchable: 'string'
        },
        doctorLastname: {
          searchable: 'string'
        },
        doctorFirstname: {
          searchable: 'string'
        }
      }
    }
  })
  console.timeEnd('fst loaded')

  // console.time(`${patients.length} patients indexed`)
  // await fst.insertRecords('patient', patients)
  // console.timeEnd(`${patients.length} patients indexed`)

  // console.log(JSON.stringify(fst.store.nodes, null, 2))

  process.stdout.write('fst> ')
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false })
  rl.on('line', function (line) {
    console.time('response time')
    fst.search('patient', {}, line).then(results => {
      console.timeEnd('response time')
      for (const result of results) {
        const r = result.record
        console.info(`  W${result.weight}: ${r.lastname} ${r.firstname} sejour=${r.stayNumber} isActive=${r.isActive ? '1' : '0'} venue=${r.typeDeVenue} heberg=${r.uniteDHebergement} lit=${r.lit} doc=${r.doctorLastname} ${r.doctorFirstname} ${r.doctorRpps}`)
      }
      process.stdout.write('\nfst> ')
    }).catch(err => {
      console.warn('ERROR ', err)
      process.stdout.write('\nfst> ')
    })
  })

  // const queries = [
  //   { filters: {}, query: '' },
  //   { filters: {}, query: 'ma' },
  //   { filters: {}, query: 'maig' },
  //   { filters: {}, query: 'c' },
  //   { filters: {}, query: 'christelle' },
  //   { filters: {}, query: '2' },
  //   { filters: {}, query: '2 aurelien' },
  //   { filters: {}, query: '23' },
  //   { filters: { floor: '2' }, query: '' },
  //   { filters: { floor: '2' }, query: '2' },
  //   { filters: { floor: '2' }, query: 'au' }
  // ]
  // for (const { filters, query } of queries) {
  //   console.log(query, JSON.stringify(filters), '=>', JSON.stringify(await fst.search('patient', filters, query)))
  // }
}

main().catch(console.error)
