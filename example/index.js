const FST = require('../lib/fst')
const config = require('./config')

const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')

async function main () {
  console.time('fst loaded')
  const fst = await FST.load(config.indexes, config.options)
  console.timeEnd('fst loaded')

  // console.time(`${patients.length} patients indexed`)
  // await fst.insertRecords('patient', patients)
  // console.timeEnd(`${patients.length} patients indexed`)

  // console.log(JSON.stringify(fst.store.nodes, null, 2))

  const server = express()

  if (config.server.cors) {
    server.use(cors(config.server.cors))
  }

  server.use(bodyParser.json())

  server.use(asyncHandler(loggerAndAuthentication))

  server.post('/query/:indice/', asyncHandler(async function (req, res) {
    const indice = req.params.indice
    const body = req.body

    if (!req.auth.indexes.includes(indice)) {
      const error = new Error('You are not allowed to access to this indice.')
      error.status = 403
      throw error
    }
    if (typeof body.query !== 'string') {
      throw new Error('Format of query is invalid.')
    }

    const results = await fst.search(indice, req.auth.filters[indice], body.query)
    res.json(results)
  }))

  server.use(errorHandling)

  http.createServer(server).listen(config.server.listen.port)

  console.info('[fst-server] Server running on port', config.server.listen.port)
}

async function loggerAndAuthentication (req, res, next) {
  if (!req.headers.authorization) {
    console.info('[fst-server-no-auth]', req.method, req.originalUrl, 'from', req.ip)
    const error = new Error('You have to set an authentication token.')
    error.status = 401
    throw error
  }

  const authData = await new Promise(function (resolve, reject) {
    jwt.verify(req.headers.authorization, config.server.jwt.secret, function (err, decoded) {
      if (err) {
        err.status = 401
        console.info('[fst-server-bad-auth]', req.method, req.originalUrl, 'from', req.ip)
        return reject(err)
      }
      resolve(decoded)
    })
  })

  req.auth = {
    user: authData._user,
    indexes: Object.keys(authData).filter(indice => !indice.startsWith('_')),
    filters: authData
  }

  console.info('[fst-server]', req.method, req.originalUrl, 'from', req.ip, 'with user', req.auth.user)
  next()
}

function asyncHandler (handler) {
  return async function (req, res, next) {
    try {
      await handler(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}

async function errorHandling (error, req, res, next) {
  console.error(error.stack)
  res.status(error.status || 400)
  res.json({ error: { name: error.name, message: error.message } })
}

main().catch(console.error)
