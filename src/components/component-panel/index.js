import React from 'react'
import {
  Button,
  IconButton,
  Paper,
  TextField,
} from '@material-ui/core'
import * as mui from '@material-ui/core'
import { withStore } from 'freenit'
import {
  default as components,
  Component,
  compile,
  decompile,
} from 'components'
import { Base64 } from 'js-base64'

import LeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import RightIcon from '@material-ui/icons/KeyboardArrowRight'

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
    return `{{ ${props} }}`
}


class ComponentPanel extends React.Component {
  state = {
    caseSensitive: true,
    search: '',
    open: true,
  }

  fileInput = React.createRef()

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

  exportJson = (data) => {
    const result = {
      ...data,
      component: data.name
    }
    delete result.name
    result.children = result.children.map(item => this.exportJson(item))
    return result
  }

  loadData = (data) => {
    const result = { ...data }
    result.name = result.component
    result.component = mui[result.name] || result.name
    result.children = result.children.map(item => this.loadData(item))
    this.props.store.design.setTree(compile(result))
    return result
  }

  handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      const [ file ] = event.target.files
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = JSON.parse(e.target.result)
        this.loadData(data)
      }
      reader.readAsText(file)
    }
  }

  handleUpload = () => {
    this.fileInput.current.click()
  }

  handleSearchChange = (event) => {
    this.setState({ search: event.target.value })
  }

  filterComponents = () => {
    if (this.state.search === '') {
      return components
    }
    if (this.state.caseSensitive) {
      return components.filter(item => item.name.includes(this.state.search))
    }
    return components.filter(
      item => item.name.toLowerCase().includes(this.state.search.toLowerCase())
    )
  }

  toggleCase = () => {
    this.setState({ caseSensitive: !this.state.caseSensitive })
  }

  handleClick = () => {
    this.fileInput.current.click()
  }

  toggleHide = () => {
    this.setState({ open: !this.state.open })
  }

  render() {
    this.mui = {}
    const data = decompile(this.props.store.design.tree)
    const display = JSON.stringify(this.exportJson(data), null, 2)
    const saveData = `data:application/json;base64,${Base64.encode(display)}`
    const output = this.exportCode(data)
    const muiComponents = Object.getOwnPropertyNames(this.mui)
    let muiImport = ''
    if (muiComponents.length > 0) {
      muiImport += 'import {\n'
      muiComponents.forEach(comp => { muiImport += `  ${comp},\n` })
      muiImport += "} from '@material-ui/core'"
    }
    const codeData = Base64.encode(
      `${reactImport}${muiImport}${begining}${output}${ending}`
    )
    const caseText = this.state.caseSensitive
      ? 'A'
      : 'a'
    const icon = this.state.open ? <LeftIcon /> : <RightIcon />
    const rootStyle = this.state.open
      ? styles.root
      : { ...styles.root, width: 50 }
    const content = this.state.open
      ? (
        <div>
          <div style={styles.components}>
            <div style={styles.find}>
              <TextField
                label="Search"
                style={styles.search}
                onChange={this.handleSearchChange}
              />
              <Paper
                style={styles.case}
                onClick={this.toggleCase}
                title="Case sensitivity"
              >
                {caseText}
              </Paper>
            </div>
            {this.filterComponents().map(
              data => <Component data={data} key={data.identity} />
            )}
          </div>
          <Paper style={styles.components.container}>
            <a href={saveData} download="design.json">
              <Button
                color="primary"
                variant="outlined"
                style={styles.components.button}
              >
                Save
              </Button>
            </a>
            <Button
              variant="outlined"
              color="secondary"
              onClick={this.handleClick}
              style={styles.components.button}
            >
              Load
            </Button>
            <a
              href={`data:application/javascript;base64,${codeData}`}
              download="page.js"
            >
              <Button style={styles.components.button} variant="outlined">
                Export
              </Button>
            </a>
          </Paper>
        </div>
      ) : null
    return (
      <div style={rootStyle}>
        <div style={styles.toggle}>
          <IconButton onClick={this.toggleHide}>{icon}</IconButton>
        </div>
        <input
          ref={this.fileInput}
          type="file"
          accept=".json"
          style={styles.input}
          multiple
          onChange={this.handleFileChange}
        />
        {content}
      </div>
    )
  }
}

export default withStore(ComponentPanel)
