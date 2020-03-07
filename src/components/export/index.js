import React from 'react'
import { withStore } from 'freenit'

import { decompile } from 'components'

import styles from './styles'

const reactImport = "import React from 'react'\n"
const begining = `


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
  mui = {}

  exportCode = (data, level = 6) => {
    if (typeof data.component !== 'string') {
      this.mui[data.name] = true
    }
    let output = ' '.repeat(level)
    output += `<${data.name}`
    Object.getOwnPropertyNames(data.props).forEach(propName => {
      const propValue = stringify(data.props[propName])
      output += ` ${propName}=${propValue}`
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
      output += `</${data.name}>\n`
    }
    return output
  }

  render() {
    this.mui = {}
    const data = decompile(this.props.store.design.tree)
    const output = this.exportCode(data)
    const muiComponents = Object.getOwnPropertyNames(this.mui)
    let muiImport = ''
    if (muiComponents.length > 0) {
      muiImport += 'import {\n'
      muiComponents.forEach(comp => { muiImport += `  ${comp},\n` })
      muiImport += "} from '@material-ui/core'"
    }
    return (
      <div style={styles.root}>
        Export
        <pre>
          {reactImport}
          {muiImport}
          {begining}
          {output}
          {ending}
        </pre>
      </div>
    )
  }
}

export default withStore(Export)
