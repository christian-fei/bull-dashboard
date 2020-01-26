const Redis = require('ioredis')

module.exports = {
  getClient
}

function getClient ({ host = '127.0.0.1', port = 6379, db = '0', password = undefined } = {}) {
  const options = {
    host, port, db
  }
  if (password) {
    options.password = password
  }
  const client = new Redis(options)
  const keys = (pattern) => client.keys(pattern)
  return { keys, host, port, db, password }
}
