const FST = require('./lib/fst')
const patients = require('./patients')

async function main () {
  const fst = await FST.load({
    indexes: {
      patient: {
        fields: {
          lastname: {
          },
          firstname: {
          },
          floor: {
          },
          nip: {
          }
        }
      }
    }
  })

  for (const patient of patients) {
    await fst.insertRecord('patient', patient)
  }

  console.log(JSON.stringify(fst.nodes, null, 2))
  return

  const queries = [
    { filters: {}, query: '' },
    { filters: {}, query: 'ma' },
    { filters: {}, query: 'maig' },
    { filters: {}, query: 'c' },
    { filters: {}, query: 'christelle' },
    { filters: {}, query: '2' },
    { filters: {}, query: '2 aurelien' },
    { filters: {}, query: '23' },
    { filters: { floor: '2' }, query: '' },
    { filters: { floor: '2' }, query: '2' },
    { filters: { floor: '2' }, query: 'au' }
  ]
  for (const { filters, query } of queries) {
    console.log(query, JSON.stringify(filters), '=>', JSON.stringify(await fst.search('patient', filters, query)))
  }
}

main().catch(console.error)
