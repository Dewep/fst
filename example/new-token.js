const jwt = require('jsonwebtoken')
const config = require('./config').server.jwt

const authData = {
  _user: 'root/dewep',
  patient: {}
}

console.info({ token: jwt.sign(authData, config.secret) })
console.info({ authData })
