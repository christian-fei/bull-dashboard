import * as preact from '/preact.js'
import Job from '/components/Job.js'
// import Chart from '/components/Chart.js'
const { Component } = preact

export default class Queue extends Component {
  render () {
    const { queue, state, updateState } = this.props
    if (!queue) return
    return preact.h('div', { className: `queue queue-${queue.name}` }, [
      preact.h('h1', { className: 'queue-name' }, [queue.name]),
      // preact.h(Chart, { data: chartFor(queue[state.showQueueType]) }),
      preact.h('div', { className: 'queue-types' }, [
        ['active', 'completed', 'failed', 'waiting', 'delayed'].map(type => preact.h('div', {
          onClick: () => updateState({ showQueue: queue.name, showQueueType: type })
        }, [
          preact.h('span', { className: 'queue-type-name' }, [type]),
          preact.h('span', { className: 'queue-type-count' }, [queue[`${type}Length`]])
        ]))
      ]),
      preact.h('div', { className: 'queue-details' }, [
        preact.h('div', { className: 'queue-preview' }, queue[`${state.showQueueType}Length`] && queue[`${state.showQueueType}Length`] > 0 ? [
          preact.h('ul', { className: '' }, queue[state.showQueueType].map(job => preact.h(Job, job))),
          preact.h('pre', { className: '' }, [
            JSON.stringify(queue[state.showQueueType], null, 4)
          ])
        ] : [
          preact.h('div', { className: 'empty-queue' }, [
            `Empty "${state.showQueueType}" jobs`
          ])
        ])
      ].filter(Boolean))
    ])
  }
}

function chartFor (jobs) {
  const filtered = jobs.filter(job => Number.isFinite(job.finishedOn) && Number.isFinite(job.processedOn))
  const durations = filtered.map(job => job.finishedOn - job.processedOn)
  const max = Math.max(...durations)
  const min = Math.min(...durations)
  const delta = max - min
  return durations.map(d => {
    return (d - min) / delta * 1000
  })
}
