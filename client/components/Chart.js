import * as preact from '/preact.js'
const { Component } = preact

export default class Chart extends Component {
  render ({ data }) {
    const height = 40
    const width = 1200
    return preact.h('svg', { width, height, className: 'chart' }, data
      .map((item, i) =>
        preact.h('rect', {
          width: width / data.length,
          y: height - item,
          x: i * width / 100,
          height: item
        })
      )
    )
  }
}
