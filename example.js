#!/usr/bin/env node
const Bull = require('bull')

main()

async function main () {
  const redisOptions = { host: '127.0.0.1', port: 6379, db: '0' }
  const backupQueue = new Bull('backup', { prefix: 'example', redis: redisOptions })

  backupQueue.process(async (job, done) => {
    console.log('processing', job.id, job.data)
    await new Promise((resolve) => setTimeout(resolve, 100))
    done()
  })

  setInterval(async () => {
    backupQueue.add({ time: new Date() })
  }, 300)
}
