import React from 'react'
import { withStore } from 'freenit'

import { decompile } from 'components'

import styles from './styles'

const begining = `
import React from 'react'
import * as mui from '@material-ui/core'


class Page extends React.Component {
  render() {
    return (
`


const ending = `    )
  }
}


export default Page
`

function stringify(obj_from_json){
    if(typeof obj_from_json !== "object" || Array.isArray(obj_from_json)){
        // not an object, stringify using native function
        return JSON.stringify(obj_from_json);
    }
    // Implements recursive object serialization according to JSON spec
    // but without quotes around the keys.
    const props = Object
        .keys(obj_from_json)
        .map(key => `${key}: ${stringify(obj_from_json[key])}`)
        .join(", ")
    return `{${props}}`
}


class Export extends React.Component {
  exportCode = (data, level = 6) => {
    let output = ' '.repeat(level)
    output += typeof data.component === 'string'
      ? `<${data.name}`
      : `<mui.${data.name}`
    Object.getOwnPropertyNames(data.props).forEach(propName => {
      const propValue = stringify(data.props[propName])
      output += typeof data.props[propName] === 'string'
        ? ` ${propName}=${propValue}`
        :  ` ${propName}={${propValue}}`
    })
    const containsData = data.text || data.children.length > 0
    output += containsData
      ? '>\n'
      : ' />\n'
    if (data.text) { output += ' '.repeat(level + 2) + data.text + '\n' }
    output += data.children.map(
      item => this.exportCode(item, level + 2),
    ).join('')
    if (containsData) {
      output += ' '.repeat(level)
      output += typeof data.component === 'string'
        ? `</${data.name}>\n`
        : `</mui.${data.name}>\n`
    }
    return output
  }

  render() {
    const data = decompile(this.props.store.design.tree)
    const output = this.exportCode(data)
    return (
      <div style={styles.root}>
        Export
        <pre>
          {begining}
          {output}
          {ending}
        </pre>
      </div>
    )
  }
}

export default withStore(Export)
