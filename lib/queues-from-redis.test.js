const test = require('ava')
const queuesFromRedis = require('./queues-from-redis')

test('returns queues from redis given a namespace', async t => {
  const client = {
    async keys () { return [`bull:scrape_123`] }
  }
  const queues = await queuesFromRedis(client, `bull:scrape*`)
  t.is(queues.length, 1)
})
