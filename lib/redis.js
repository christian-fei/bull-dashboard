const redis = require('redis')
const { promisify } = require('util')

module.exports = {
  getClient
}

function getClient ({ host = '127.0.0.1', port = 6379, db = '0' } = {}) {
  const client = redis.createClient({ host, port, db })
  const _keys = promisify(client.keys.bind(client))

  return { keys }

  async function keys (pattern) { return _keys(`bull:*`) }
}
