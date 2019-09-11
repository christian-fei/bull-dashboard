#!/usr/bin/env node
const { queuesFromRedis } = require('.')
const redis = require('./lib/redis')

main()

async function main () {
  const redisOptions = { host: '127.0.0.1', port: 6379, db: '0' }
  const client = redis.getClient(redisOptions)
  const queues = await queuesFromRedis(client)
  console.log('queues', queues)
  // console.log(queues[0])
  // for (const queue of queues) {
  //   console.log('processing queue', queue.name)
  //   queue.on('error', console.error)
  //   queue.on('waiting', console.log)
  //   queue.on('active', console.log)
  //   queue.on('stalled', console.log)
  //   queue.on('progress', console.log)
  //   queue.on('completed', console.log)
  //   queue.on('failed', console.log)
  //   queue.on('paused', console.log)
  //   queue.on('resumed', console.log)
  //   queue.on('removed', console.log)
  //   queue.on('cleaned', console.log)
  //   queue.on('drained', console.log)
  // }
  setInterval(async () => {
    for (const queue of queues) {
      console.time('queue')
      const active = await queue.getActive()
      // console.log('-- queue active', active.length)
      const completed = await queue.getCompleted()
      // console.log('-- queue completed', completed.length)
      const failed = await queue.getFailed()
      // console.log('-- queue failed', failed.length)
      const waiting = await queue.getWaiting()
      // console.log('-- queue waiting', waiting.length)
      const delayed = await queue.getDelayed()
      // console.log('-- queue delayed', delayed.length)
      console.log(`
-- "${queue.name}" --
active: ${active.length}
completed: ${completed.length}
failed: ${failed.length}
waiting: ${waiting.length}
delayed: ${delayed.length}
`)
      console.timeEnd('queue')
    }
    console.log('\n')
  }, 1000)
}
