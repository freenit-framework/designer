import React from 'react'
import {
  Button,
  IconButton,
  Paper,
  TextField,
} from '@material-ui/core'
import * as icons from '@material-ui/icons'
import * as mui from '@material-ui/core'
import { withStore } from 'freenit'
import {
  default as components,
  compile,
  convert,
  decompile,
  toProps,
  Component,
  Icon,
} from 'components'
import { Base64 } from 'js-base64'

import LeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import RightIcon from '@material-ui/icons/KeyboardArrowRight'
import types from 'types'

import styles from './styles'


const iconNames = Object.getOwnPropertyNames(icons).filter(icon => {
  if (icons[icon].muiName !== 'SvgIcon') { return false }
  if (icon[0] !== icon[0].toUpperCase()) { return false }
  if (icon.endsWith('Outlined')) { return false }
  if (icon.endsWith('Rounded')) { return false }
  if (icon.endsWith('Sharp')) { return false }
  if (icon.endsWith('TwoTone')) { return false }
  return true
})
const iconData = iconNames.map(name => ({ ...icons[name], name }))


const reactImport = "import React from 'react'\n"
const themeImport = "import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'\n"
const begining = `

class Page extends React.Component {
  render() {
    return (
      <ThemeProvider theme={createMuiTheme(theme)}>
`


const ending = `      </ThemeProvider>
    )
  }
}


export default Page
`

const stringify = (obj_from_json) => {
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


const tabLabels = [
  'components',
  'icons',
]


class ComponentPanel extends React.Component {
  state = {
    caseSensitive: true,
    search: '',
    open: true,
    tab: 'components'
  }

  fileInput = React.createRef()

  mui = {}
  icons = {}

  exportCode = (data, level = 8) => {
    if (typeof data.component !== 'string') {
      if (data.type === types.COMPONENT) {
        this.mui[data.name] = true
      } else if (data.type === types.ICON) {
        this.icons[data.name] = true
      }
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

  exportTheme = (data, level = 0) => {
    if(typeof data !== "object" || Array.isArray(data)){
      // not an object, stringify using native function
      return JSON.stringify(data);
    }
    // Implements recursive object serialization according to JSON spec
    // but without quotes around the keys.
    const ident = ' '.repeat(level + 2)
    const props = Object
      .keys(data)
      .map(key => `${ident}${key}: ${this.exportTheme(data[key], level + 2)},\n`)
      .join("")
    let output = '{\n'
    output += `${props}`
    output += ' '.repeat(level)
    output += '}'
    return output
  }

  loadData = (data, top = true) => {
    const result = { ...data }
    result.name = result.component
    if (result.type === types.ICON) {
      result.component = icons[result.name]
    } else {
      result.component = mui[result.name] || result.name
    }
    result.children = result.children.map(item => this.loadData(item, false))
    if (top) {
      this.props.store.design.setTree(compile(result))
      const theme = convert('theme', result.theme || {})
      this.props.store.design.setTheme(theme)
    }
    return result
  }

  handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      const [ file ] = event.target.files
      const reader = new FileReader()
      reader.onload = (e) => {
        const { theme, tree } = this.props.store
        const data = JSON.parse(e.target.result)
        if (data.tree && data.theme) {
          tree.setTree(data.tree)
          theme.setTheme(data.theme)
        } else {
          this.loadData(data)
        }
      }
      reader.readAsText(file)
    }
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

  filterIcons = () => {
    if (this.state.search === '') {
      return iconData
    }
    if (this.state.caseSensitive) {
      return iconData.filter(
        item => item.name.includes(this.state.search)
      )
    }
    return iconData.filter(
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

  switchTab = (tab) => () => {
    this.setState({ tab })
  }

  render() {
    this.mui = {}
    const { tree, theme } = this.props.store
    const data = decompile(tree.tree)
    data.theme = toProps(theme.theme || {})
    const result = {
      tree: tree.tree,
      theme: theme.theme,
    }
    const display = JSON.stringify(result, null, 2)
    const saveData = `data:application/json;base64,${Base64.encode(display)}`
    const output = this.exportCode(data)
    let themeOutput = `\n\nconst theme = ${this.exportTheme(data.theme)}`
    themeOutput += '\n'
    const muiComponents = Object.getOwnPropertyNames(this.mui)
    let muiImport = ''
    if (muiComponents.length > 0) {
      muiImport += 'import {\n'
      muiComponents.forEach(comp => { muiImport += `  ${comp},\n` })
      muiImport += "} from '@material-ui/core'\n"
    }
    const iconComponents = Object.getOwnPropertyNames(this.icons)
    let iconImport = ''
    if (iconComponents.length > 0) {
      iconImport += 'import {\n'
      iconComponents.forEach(comp => { iconImport += `  ${comp},\n` })
      iconImport += "} from '@material-ui/icons'\n"
    }
    const codeData = Base64.encode(
      `${reactImport}${muiImport}${iconImport}${themeImport}${themeOutput}${begining}${output}${ending}`
    )
    const caseText = this.state.caseSensitive
      ? 'A'
      : 'a'
    const icon = this.state.open ? <LeftIcon /> : <RightIcon />
    const rootStyle = this.state.open
      ? styles.root
      : { ...styles.root, width: 50 }
    let content
    if (this.state.open) {
      content = this.state.tab === 'components'
        ? (
          <div style={styles.components}>
            {this.filterComponents().map(
              data => <Component data={data} key={data.identity} />
            )}
          </div>
        ) : (
          <div style={styles.icons}>
            {
              this.filterIcons().map(
                data => <Icon key={data.name} icon={data} />
              )
            }
          </div>
        )
    }
    const tabs = this.state.open
      ? tabLabels.map(label => (
        <Button
          key={label}
          style={styles.button}
          variant="outlined"
          onClick={this.switchTab(label)}
          disabled={label === this.state.tab}
        >
          {label}
        </Button>
      )) : null
    return (
      <div style={rootStyle}>
        <div style={styles.toggle}>
          {tabs}
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
        {
          this.state.open
            ? (
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
            ) : null
        }
        {content}
        {
          this.state.open
            ? (
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
            ) : null
        }
      </div>
    )
  }
}


export default withStore(ComponentPanel)
