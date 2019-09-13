#!/usr/bin/env node
const Bull = require('bull')

main()

async function main () {
  const redisOptions = { host: '127.0.0.1', port: 6379, db: '0' }
  const backupQueue = new Bull('backup', { prefix: 'example', redis: redisOptions })

  backupQueue.process((job, done) => {
    console.log('processing', job.id, job.data)
    setTimeout(done, 100)
  })

  setInterval(async () => {
    backupQueue.add({ time: new Date() })
  }, 300)
}
