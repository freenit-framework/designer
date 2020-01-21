import React from 'react'
import { withStore } from 'freenit'
import * as mui from '@material-ui/core'
import { compile, decompile } from 'components'

import styles from './styles'


class Save extends React.Component {
  fileInput = React.createRef()

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

  render() {
    const data = decompile(this.props.store.design.tree)
    const display = JSON.stringify(this.exportJson(data), null, 2)
    return (
      <div style={styles.root}>
        <mui.Button
          variant="outlined"
          color="primary"
          onClick={this.handleUpload}
        >
          Load file
        </mui.Button>
        <input
          ref={this.fileInput}
          type="file"
          accept=".json"
          style={styles.input}
          multiple
          onChange={this.handleFileChange}
        />
        <pre>
          {display}
        </pre>
      </div>
    )
  }
}

export default withStore(Save)
