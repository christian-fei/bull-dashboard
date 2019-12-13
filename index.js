const Queue = require('bull')
const server = require('./server')

module.exports = {
  queuesFromRedis,
  server
}

async function queuesFromRedis (client, namespace = 'bull') {
  const queuesWithJobs = await client.keys(`${namespace}:*`)
  const namespaceRegExp = /:([^:]+)/
  const queueNames = Array.from(new Set(queuesWithJobs
    .map(q => q.match(namespaceRegExp))
    .filter(Boolean)
    .map(x => x[1])
    .filter(Boolean)
    .filter(x => x.indexOf(':') === -1)
    .filter(x => x !== '[object Object]')
  ))

  return queueNames.map(queueName => new Queue(queueName, {
    redis: client
  }))
}
