const Redis = require('ioredis')

module.exports = {
  getClient
}

function getClient ({ host = '127.0.0.1', port = 6379, db = '0' } = {}) {
  const client = new Redis({ host, port, db })
  const keys = (pattern) => client.keys(pattern)
  return { keys }
}
