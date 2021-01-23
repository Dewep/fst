const FST = require('../lib/fst')
const config = require('./config')

const prescribers = require('./data/prescribers.json')
const organizations = require('./data/organizations.json')

async function main () {
  console.time('fst loaded')
  const fst = await FST.load(config.indexes, config.options)
  console.timeEnd('fst loaded')

  // {
  //   "identifier" : {
  //           "type" : "RPPS",
  //           "value" : "11111111111"
  //   },
  //   "slug" : "RPPS-11111111111",
  //   "lastname" : "PandaLab",
  //   "firstname" : "Test",
  //   "gender" : "M",
  //   "profession" : "informaticien",
  //   "speciality" : "Assistant",
  //   "organizations" : [
  //           "FINESS-999999999",
  //           "SIREN-820708055",
  //           "SIRET-82070805500018"
  //   ]
  // }
  const prescribersList = []
  for (const prescriber of prescribers) {
    const data = {
      slug: prescriber.slug,
      type: prescriber.identifier.type,
      identifier: prescriber.identifier.value,
      lastname: prescriber.lastname,
      firstname: prescriber.firstname,
      gender: prescriber.gender,
      profession: prescriber.profession,
      speciality: prescriber.speciality
    }
    prescribersList.push(data)
  }
  console.time(`${prescribersList.length} prescribers indexed`)
  await fst.insertRecords('prescriber', prescribersList)
  console.timeEnd(`${prescribersList.length} prescribers indexed`)

  // {
  //   "identifier" : {
  //           "type" : "FINESS",
  //           "value" : "999999999"
  //   },
  //   "slug" : "FINESS-999999999",
  //   "name" : "PandaLab SAS",
  //   "address" : "2 rue des Bégonias\n54000 Nancy",
  //   "phone" : "0680718544",
  //   "email" : "contact@pandalab.fr"
  // }
  const organizationsList = []
  for (const organization of organizations) {
    const data = {
      slug: organization.slug,
      type: organization.identifier.type,
      identifier: organization.identifier.value,
      name: organization.name,
      address: organization.address,
      phone: organization.phone,
      email: organization.email
    }
    organizationsList.push(data)
  }
  console.time(`${organizationsList.length} organizations indexed`)
  await fst.insertRecords('organization', organizationsList)
  console.timeEnd(`${organizationsList.length} organizations indexed`)
}

main().catch(console.error)
