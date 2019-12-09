import * as preact from '/preact.js'
const { Component, h } = preact

export default class Chart extends Component {
  render ({ data }) {
    if (!Array.isArray(data) || data.length < 10) return h('div', { className: 'chart' }, null)
    const height = 100
    const width = 1200
    const max = Math.max(...data)
    return h('svg', { width, height, className: 'chart' }, data
      .map((durationInMs, i) => {
        const rectHeight = durationInMs * 100 / max
        return h('rect', {
          width: width / data.length,
          y: height - rectHeight,
          x: i * width / 100,
          height: rectHeight
        })
      }
      )
    )
  }
}
