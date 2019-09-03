const patients = require('./patients.json')

const list = []

const doctors = {
}
for (const patient of patients) {
  const rpps = (patient.externalConnection.rpps && patient.externalConnection.rpps.trim()) || null
  const data = {
    slug: patient.slug,
    lastname: patient.lastname,
    firstname: patient.firstname,
    stayNumber: patient.stayNumber,
    isActive: patient.isActive,
    typeDeVenue: patient.externalConnection.typeDeVenue,
    uniteDHebergement: patient.externalConnection.uniteDHebergement,
    lit: patient.externalConnection.lit,
    doctorRpps: rpps,
    doctorLastname: (rpps && doctors[rpps] && doctors[rpps].lastname),
    doctorFirstname: (rpps && doctors[rpps] && doctors[rpps].firstname)
    // doctorSpeciality: (rpps && doctors[rpps] && doctors[rpps].speciality)
  }
  list.push(data)
}

module.exports = list
