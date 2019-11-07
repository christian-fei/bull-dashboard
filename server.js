#!/usr/bin/env node
const express = require('express')
const SSE = require('express-sse')
const { queuesFromRedis } = require('.')
const redis = require('./lib/redis')
const namespace = process.argv[2]
const history = process.argv[3]
const delay = process.argv[4]

main({ namespace, history, delay })

async function main ({ namespace = 'bull', history = 100, delay = 100 } = {}) {
  const app = express()
  const sse = new SSE()

  app.use('/', express.static('client'))
  app.get('/stream', sse.init)
  app.listen(process.env.HTTP_PORT || process.env.PORT || 4000)

  const redisOptions = { host: '127.0.0.1', port: 6379, db: '0' }
  const client = redis.getClient(redisOptions)
  let queues = await queuesFromRedis(client, namespace)
  setInterval(async () => {
    queues = await queuesFromRedis(client, namespace)
  }, 5000)

  while (true) {
    // console.clear()
    const data = []
    for (const queue of queues) {
      let active = await queue.getActive()
      const activeLength = active.length
      active = slim(active, history)
      let completed = await queue.getCompleted()
      const completedLength = completed.length
      completed = slim(completed, history)
      let failed = await queue.getFailed()
      const failedLength = failed.length
      failed = slim(failed, history)
      let waiting = await queue.getWaiting()
      const waitingLength = waiting.length
      waiting = slim(waiting, history)
      let delayed = await queue.getDelayed()
      const delayedLength = delayed.length
      delayed = slim(delayed, history)
      process.stdout.write(`-- ${queue.name.padEnd(20)} \tactive: ${activeLength}\tcompleted: ${completedLength}\tfailed: ${failedLength}\twaiting: ${waitingLength}\tdelayed: ${delayedLength}\n`)
      data.push({
        name: queue.name,
        active,
        activeLength,
        completed,
        completedLength,
        failed,
        failedLength,
        waiting,
        waitingLength,
        delayed,
        delayedLength
      })
    }
    sse.send(data)
    data.length = 0

    await new Promise((resolve) => setTimeout(resolve, delay))
  }
}

function slim (data, history) {
  const keys = ['id', '_progress', 'finishedOn', 'processedOn', 'timestamp', 'data']
  return data.slice(0, history).map(d => {
    return keys.reduce((acc, key) => { acc[key] = d[key]; return acc }, {})
  })
    .map(d => Object.assign(d, { progress: d._progress }))
}
