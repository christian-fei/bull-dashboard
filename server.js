#!/usr/bin/env node
const express = require('express')
const SSE = require('express-sse')
const { queuesFromRedis } = require('.')
const redis = require('./lib/redis')
const { join, dirname } = require('path')
const { realpathSync } = require('fs')

module.exports = main

async function main ({ namespace = 'bull', history = 100, delay = 100, port } = {}) {
  const app = express()
  const sse = new SSE()

  const staticDirPath = join(dirname(realpathSync(process.argv[1])), 'client')
  console.log({ staticDirPath })
  app.use('/', express.static(staticDirPath))
  app.get('/stream', sse.init)
  app.listen(port || process.env.HTTP_PORT || process.env.PORT || 4000)

  const redisOptions = { host: process.env.REDIS_HOST || '0.0.0.0', port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379, db: process.env.REDIS_DB || '0' }
  console.log({ redisOptions, namespace })
  const client = redis.getClient(redisOptions)
  let queues = await queuesFromRedis(client, namespace)
  setInterval(async () => {
    queues = await queuesFromRedis(client, namespace)
  }, 5000)

  while (true) {
    // console.clear()
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

    await new Promise((resolve) => setTimeout(resolve, delay))
  }
}
