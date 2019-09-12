#!/usr/bin/env node
const express = require('express')
const SSE = require('express-sse')
const { queuesFromRedis } = require('.')
const redis = require('./lib/redis')

main()

async function main () {
  const app = express()
  const sse = new SSE()

  app.use('/', express.static('client'))
  app.get('/stream', sse.init)
  app.listen(process.env.HTTP_PORT || process.env.PORT || 4000)

  const redisOptions = { host: '127.0.0.1', port: 6379, db: '0' }
  const client = redis.getClient(redisOptions)
  const queues = await queuesFromRedis(client)
  setInterval(async () => {
    console.clear()
    const data = []
    for (const queue of queues) {
      const { active, completed, failed, waiting, delayed } = await status(queue)
      console.log(`-- ${queue.name.padEnd(20)} \tactive: ${active.length}\tcompleted: ${completed.length}\tfailed: ${failed.length}\twaiting: ${waiting.length}\tdelayed: ${delayed.length}`)
      data.push({
        name: queue.name,
        active: active.slice(0, 10),
        activeLength: active.length,
        completed: completed.slice(0, 10),
        completedLength: completed.length,
        failed: failed.slice(0, 10),
        failedLength: failed.length,
        waiting: waiting.slice(0, 10),
        waitingLength: waiting.length,
        delayed: delayed.slice(0, 10),
        delayedLength: delayed.length })
    }
    sse.send(data)
  }, 500)
}

async function status (queue) {
  const [
    active, completed, failed, waiting, delayed
  ] = await Promise.all([
    await queue.getActive(),
    await queue.getCompleted(),
    await queue.getFailed(),
    await queue.getWaiting(),
    await queue.getDelayed()
  ])

  return {
    active,
    completed,
    failed,
    waiting,
    delayed
  }
}
