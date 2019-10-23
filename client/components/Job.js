import * as preact from '/preact.js'
const { Component } = preact

export default class Job extends Component {
  render () {
    const job = this.props
    if (!job) return null
    const { id, progress, finishedOn, processedOn, timestamp, data } = job
    return preact.h('div', { className: `job ${id}`, key: id }, [
      preact.h('span', { className: 'job-id' }, id),
      // preact.h('span', {className: 'job-delay'}, delay),
      preact.h('span', { className: 'job-progress' }, `${progress}%`),
      // preact.h('span', {className: 'job-attempts'}, opts.attempts),
      // preact.h('span', {className: 'job-attempts-made'}, attemptsMade),
      finishedOn && preact.h('span', { className: 'small' }, `took ${humanMS(finishedOn - processedOn)}`),
      preact.h('small', { className: 'small' }, `\t@ ${new Date(timestamp).toISOString()}`),
      Object.keys(data || {}).length > 0 ? preact.h('div', { className: `` }, [
        preact.h('code', { className: 'small' }, `\t${JSON.stringify(data)}`)
      ]) : null
      // \tprocessedOn: ${new Date(processedOn).toISOString()}
      // \tfinishedOn: ${new Date(finishedOn).toISOString()}
      // \tduration: ${humanMS(finishedOn - processedOn)}
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
