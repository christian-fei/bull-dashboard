import * as preact from '/preact.js'
import Job from '/components/Job.js'
const { Component } = preact

export default class Queue extends Component {
  render () {
    const { queue, state, updateState } = this.props
    if (!queue) return
    return preact.h('div', { className: `queue queue-${queue.name}` }, [
      preact.h('h1', { className: 'queue-name' }, [queue.name]),
      preact.h('div', { className: 'queue-details' }, [
        preact.h('div', { className: 'queue-types' }, [
          ['active', 'completed', 'failed', 'waiting', 'delayed'].map(type => preact.h('div', {
            onClick: () => updateState({ showQueue: queue.name, showQueueType: type })
          }, [
            preact.h('span', { className: 'queue-type-name' }, [type]),
            preact.h('span', { className: 'queue-type-count' }, [queue[type].length])
          ]))
        ]),
        preact.h('div', { className: 'queue-preview' }, [
          preact.h('ul', { className: '' }, queue[state.showQueueType] && queue[state.showQueueType].map(job => preact.h(Job, job))),
          preact.h('pre', { className: '' }, [
            JSON.stringify(queue[state.showQueueType], null, 4)
          ])
        ])
      ].filter(Boolean))
    ])
  }
}
