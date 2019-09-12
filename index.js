const Queue = require('bull')

module.exports = {
  queuesFromRedis
}

async function queuesFromRedis (client, namespace = 'bull') {
  const queuesWithJobs = await client.keys(`${namespace}:*`)
  // const namespaceRegExp = new RegExp(namespace + ':([^:]+)')
  const namespaceRegExp = /:([^:]+)/
  const queueNames = Array.from(new Set(queuesWithJobs
    .map(q => q.match(namespaceRegExp))
    .filter(Boolean)
    .map(x => x[1])
    .filter(Boolean)
    .filter(x => x.indexOf(':') === -1)
  ))
  // console.log({ queuesWithJobs })
  return queueNames.map(queueName => new Queue(queueName))
}

// async function set (key, value) {
//   if (typeof value === 'object') value = JSON.stringify(value)
//   key = key.toLowerCase()
//   return _set(key, value)
// }

// function setFor (key) {
//   return (value) => set(key, value)
// }

// async function get (pattern) {
//   const keysForPattern = await _keys(pattern)
//   const acc = []
//   for (const key of keysForPattern) {
//     let item = await _get(key)
//     if (item.startsWith('{')) item = JSON.parse(item)
//     acc.push(item)
//   }
//   return acc
// }

// async function del (pattern) {
//   _del(pattern)
// }
