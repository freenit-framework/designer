import React from 'react'
import { toJS } from 'mobx'
import { deepObserve } from 'mobx-utils'
import { Button, Paper, Switch } from '@material-ui/core'
import { Base64 } from 'js-base64'

import components from 'components'
import types from 'types'
import store from 'store'
import { decompile } from 'utils'
import styles from './styles'

const exportTemplates = {
  class: {
    begining: `
class Page extends React.Component {
  render() {
    return (
      <ThemeProvider theme={createMuiTheme(theme)}>`,
    ending: `
      </ThemeProvider>
    )
  }
}

export default Page
`,
  },
  function: {
    begining: `
const Page = (props) => {
  return (
    <ThemeProvider theme={createMuiTheme(theme)}>`,
    ending: `
    </ThemeProvider>
  )
}

export default Page
`,
  },
}

const reactImport = "import React from 'react'\n"
const themeImport =
  "import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'\n"

const stringify = (obj_from_json) => {
  if (typeof obj_from_json !== 'object' || Array.isArray(obj_from_json)) {
    // not an object, stringify using native function
    return JSON.stringify(obj_from_json)
  }
  // Implements recursive object serialization according to JSON spec
  // but without quotes around the keys.
  const props = Object.keys(obj_from_json)
    .map((key) => `${key}: ${stringify(obj_from_json[key])}`)
    .join(', ')
  return `{{ ${props} }}`
}

class FileControls extends React.Component {
  state = {
    func: false,
    tree: toJS(store.design.tree),
    theme: decompile(toJS(store.design.theme)),
  }

  mui = {}
  icons = {}
  fileInput = React.createRef()
  toggleFunc = () => this.setState({ func: !this.state.func })

  constructor(props) {
    super(props)
    deepObserve(store.design.tree, () => {
      this.setState({ tree: toJS(store.design.tree) })
    })
    deepObserve(store.design.theme, () => {
      this.setState({ theme: decompile(toJS(store.design.theme)) })
    })
  }

  usedComponents = (data) => {
    if (typeof data.type !== 'html') {
      if (data.type === 'mui') {
        this.mui[data.name] = true
      } else if (data.type === 'icon') {
        this.icons[data.name] = true
      }
    }
    data.children.forEach((child) => {
      this.usedComponents(child)
    })
  }

  exportCode = (data, level = 8) => {
    let output = '\n'
    output += ' '.repeat(level)
    output += `<${data.name}`
    Object.keys(data.props).forEach((propName) => {
      const propValue = stringify(data.props[propName])
      output += ` ${propName}=${propValue}`
    })
    const containsData = data.text || data.children.length > 0
    output += containsData ? '>' : ' />'
    if (data.text) {
      output += `\n${' '.repeat(level + 2)}${data.text}`
    }
    output += data.children
      .map((item) => this.exportCode(item, level + 2))
      .join('')
    if (containsData) {
      output += '\n'
      output += ' '.repeat(level)
      output += `</${data.name}>`
    }
    return output
  }

  exportTheme = (data, level = 0) => {
    if (typeof data !== 'object' || Array.isArray(data)) {
      // not an object, stringify using native function
      return JSON.stringify(data)
    }
    // Implements recursive object serialization according to JSON spec
    // but without quotes around the keys.
    const ident = ' '.repeat(level + 2)
    const props = Object.keys(data)
      .map(
        (key) => `${ident}${key}: ${this.exportTheme(data[key], level + 2)},\n`
      )
      .join('')
    let output = '{\n'
    output += `${props}`
    output += ' '.repeat(level)
    output += '}'
    return output
  }

  handleLoad = () => {
    this.fileInput.current.click()
  }

  loadData = (data) => {
    const result = { ...data }
    result.name = result.component
    if (result.type === types.ICON) {
      result.type = 'icons'
    } else {
      let component = components.mui[result.name]
      if (!component) {
        result.type = 'html'
      } else {
        result.type = 'mui'
      }
    }
    result.children = result.children.map((item) => this.loadData(item))
    result.props = decompile(result.props)
    return result
  }

  handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      const [file] = event.target.files
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = JSON.parse(e.target.result)
        const root = this.loadData(data.tree)
        store.design.setChildren(root.children)
        store.design.setTheme(compile(data.theme))
      }
      reader.readAsText(file)
    }
  }

  render() {
    this.mui = {}
    this.icons = {}
    const { begining, ending } = this.state.func
      ? exportTemplates['function']
      : exportTemplates['class']
    const display = JSON.stringify(this.state, null, 2)
    const saveData = `data:application/json;base64,${Base64.encode(display)}`
    this.usedComponents(this.state.tree)
    const muiComponents = Object.keys(this.mui)
    let muiImport = ''
    if (muiComponents.length > 0) {
      muiImport += 'import {\n'
      muiComponents.forEach((comp) => {
        muiImport += `  ${comp},\n`
      })
      muiImport += "} from '@material-ui/core'\n"
    }
    const iconComponents = Object.keys(this.icons)
    let iconImport = ''
    if (iconComponents.length > 0) {
      iconImport += 'import {\n'
      iconComponents.forEach((comp) => {
        iconImport += `  ${comp},\n`
      })
      iconImport += "} from '@material-ui/icons'\n"
    }
    const themeOutput = `\nconst theme = ${this.exportTheme(
      this.state.theme
    )}\n`
    const level = this.state.func ? 6 : 8
    const output = this.exportCode(this.state.tree, level)
    const codeData = Base64.encode(
      `${reactImport}${muiImport}${iconImport}${themeImport}${themeOutput}${begining}${output}${ending}`
    )
    const componentType = this.state.func
      ? 'Functional Component'
      : 'Class Component'
    return (
      <Paper style={styles.file}>
        <input
          ref={this.fileInput}
          type="file"
          accept=".json"
          style={styles.input}
          onChange={this.handleFileChange}
        />
        <Switch
          checked={!this.state.func}
          color="primary"
          onChange={this.toggleFunc}
        />
        {componentType}
        <div style={styles.file.controls}>
          <a href={saveData} download="design.json">
            <Button variant="outlined" color="primary">
              Save
            </Button>
          </a>
          <Button
            variant="outlined"
            color="secondary"
            onClick={this.handleLoad}
          >
            Load
          </Button>
          <a
            href={`data:application/javascript;base64,${codeData}`}
            download="page.js"
          >
            <Button variant="outlined">Export</Button>
          </a>
        </div>
      </Paper>
    )
  }
}

export default FileControls
