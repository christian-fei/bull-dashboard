import * as preact from '/preact.js'
import Queue from '/components/Queue.js'
const { Component, h } = preact
const { eventSource } = window

export default class App extends Component {
  constructor () {
    super()
    this.state = {
      queues: [],
      showQueue: undefined,
      showQueueType: 'completed'
    }
    eventSource.onmessage = (message) => {
      if (!message || !message.data) return console.error('skipping empty message')
      const queues = JSON.parse(message.data)
      // queues.sort((q1, q2) => q1.name.localeCompare(q2.name))
      queues.sort((q1, q2) => q2.activeLength - q1.activeLength)
      this.setState({ queues })
    }

    setInterval(async () => {
      await window.fetch('/favicon.ico')
    }, 1000 * 60)
  }

  render () {
    const self = this
    const layout = this.state.queues
      .map((queue) => h(Queue, {
        queue,
        state: this.state,
        updateState: (state) => {
          self.setState(state)
        }
      }))
    return h('div', null, layout)
  }
}
