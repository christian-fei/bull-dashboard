import * as preact from '/preact.js'
const { Component } = preact

export default class Job extends Component {
  render () {
    const job = this.props
    return preact.h('div', { className: `job ${job.id}` }, [
      preact.h('span', { className: 'job-id' }, job.id),
      // preact.h('span', {className: 'job-delay'}, job.delay),
      preact.h('span', { className: 'job-progress' }, `${job.progress}%`),
      // preact.h('span', {className: 'job-attempts'}, job.opts.attempts),
      // preact.h('span', {className: 'job-attempts-made'}, job.attemptsMade),
      job.finishedOn && preact.h('span', { className: 'small' }, `took ${humanMS(job.finishedOn - job.processedOn)}`),
      preact.h('small', { className: 'small' }, `\t@ ${new Date(job.timestamp).toISOString()}`)
      // \tprocessedOn: ${new Date(job.processedOn).toISOString()}
      // \tfinishedOn: ${new Date(job.finishedOn).toISOString()}
      // \tduration: ${humanMS(job.finishedOn - job.processedOn)}
    ].filter(Boolean))
  }
}

function humanMS (ms) {
  if (!Number.isFinite(ms)) return ``
  const minutes = ms / (1000 * 60)
  const wholeMinutes = parseInt(minutes, 10)
  const seconds = (minutes - wholeMinutes) * 60
  const wholeSeconds = parseInt(seconds, 10)
  const wholeMillis = parseInt((seconds - wholeSeconds) * 1000, 10)
  let humanString = ``
  if (wholeMinutes > 0) humanString += `${wholeMinutes}m `
  if (wholeSeconds > 0) humanString += `${wholeSeconds}s `
  humanString += `${wholeMillis}ms `
  return humanString
}
