#!/usr/bin/env node
const express = require('express')
const SSE = require('express-sse')
const queuesFromRedis = require('./lib/queues-from-redis')
const redis = require('./lib/redis')
const { join, dirname } = require('path')
const { realpathSync } = require('fs')

module.exports = main

async function main ({ clear = true, namespace = 'bull', history = 100, delay = 500, port = process.env.HTTP_PORT || process.env.PORT || 4000 } = {}) {
  const app = express()
  const sse = new SSE()

  const staticDirPath = join(dirname(realpathSync(process.argv[1])), '..', 'client')
  let lastRequestAt
  app.use((req, res, next) => {
    lastRequestAt = Date.now()
    next()
  })
  app.use('/', express.static(staticDirPath))
  app.get('/stream', sse.init)
  app.listen(port)
  console.log(`visit http://localhost:${port}`)

  const redisOptions = {
    host: process.env.REDIS_HOST || '0.0.0.0',
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379,
    db: process.env.REDIS_DB || '0'
  }
  console.log(JSON.stringify({ redisOptions, namespace }))

  const client = redis.getClient(redisOptions)
  let queues = await queuesFromRedis(client, namespace)

  let lastRunAt

  run()
  setInterval(run, delay)

  async function run () {
    if (lastRequestAt < Date.now() - 1000 * 60 * 10) {
      console.log('it seems there are non active clients, skipping updates')
      return
    }

    if (lastRunAt && lastRunAt > Date.now() - delay) {
      console.log(`already ran during last interval of ${delay}`)
      return
    }

    lastRunAt = Date.now()

    queues = await queuesFromRedis(client, namespace)
    clear && console.clear()
    clear && console.log(`visit http://localhost:${port}`)

    const data = []
    for (const queue of queues) {
      await Promise.all([
        queue.getActive(0, history),
        queue.getActiveCount(),
        queue.getCompleted(0, history),
        queue.getCompletedCount(),
        queue.getFailed(0, history),
        queue.getFailedCount(),
        queue.getWaiting(0, history),
        queue.getWaitingCount(),
        queue.getDelayed(0, history),
        queue.getDelayedCount()
      ])
        .then(([active, activeLength, completed, completedLength, failed, failedLength, waiting, waitingLength, delayed, delayedLength]) => {
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
        })
    }
    sse.send(data)
    data.length = 0
  }
}
