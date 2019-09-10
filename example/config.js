const path = require('path')

module.exports = {
  // INDEXES
  indexes: {
    // PATIENT INDEXES
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
    },
    prescriber: {
      slug: {},
      type: {
        facets: true
      },
      identifier: {
        searchable: 'string'
      },
      lastname: {
        searchable: 'string'
      },
      firstname: {
        searchable: 'string'
      },
      gender: {
      },
      profession: {
        facets: true,
        searchable: 'string'
      },
      speciality: {
        searchable: 'string'
      }
    },
    organization: {
      slug: {},
      type: {
        facets: true
      },
      identifier: {
        searchable: 'string'
      },
      name: {
        searchable: 'string'
      },
      address: {
        searchable: 'string'
      },
      phone: {
        searchable: 'string'
      },
      email: {
        searchable: 'string'
      }
    }
  },

  // FST OPTIONS
  options: {
    storageRootDirectory: path.join(__dirname, 'indexes')
  },

  // OPTIONAL CONFIG, TO RUN A SERVER ON FST
  server: {
    listen: {
      port: 9570
    },
    // IF YOU WANT TO ENABLE CORS
    cors: {
      origin: [/\.pandalab\.dev$/],
      credentials: true,
      maxAge: 1728000
    },
    // JWT SECRET FOR AUTHENTICATION
    jwt: {
      secret: 'secret-example'
    }
  }
}
