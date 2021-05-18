import React from 'react'
import { toJS } from 'mobx'
import { Button, IconButton, Paper, Switch, TextField } from '@material-ui/core'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'

import { default as components, Save } from 'components'
import store from 'store'

import styles from './styles'

class LeftPane extends React.Component {
  state = {
    open: true,
    search: '',
    caseSensitive: true,
    func: false,
  }

  toggleOpen = () => {
    this.setState({ open: !this.state.open })
  }

  toggleCase = () => {
    this.setState({ caseSensitive: !this.state.caseSensitive })
  }

  toggleFunc = () => {
    this.setState({ func: !this.state.func })
  }

  changeSearch = (event) => {
    this.setState({ search: event.target.value })
  }

  filterComponents = () => {
    const result = {
      mui: {},
      html: {},
    }
    const rawMuiNames = Object.keys(components.mui)
    const muiNames = this.state.caseSensitive
      ? rawMuiNames.filter((name) => name.includes(this.state.search))
      : rawMuiNames.filter((name) =>
          name.toLowerCase().includes(this.state.search)
        )
    muiNames.forEach((name) => {
      result.mui[name] = components.mui[name]
    })
    const rawHtmlNames = Object.keys(components.html)
    const htmlNames = this.state.caseSensitive
      ? rawHtmlNames.filter((name) => name.includes(this.state.search))
      : rawHtmlNames.filter((name) =>
          name.toLowerCase().includes(this.state.search)
        )
    htmlNames.forEach((name) => {
      result.mui[name] = components.html[name]
    })
    return result
  }

  render() {
    const typesStyle = this.state.open
      ? styles.types
      : {
          ...styles.types,
          overflow: 'hidden',
          justifyContent: 'flex-end',
        }
    const controls = this.state.open ? (
      <div style={typesStyle}>
        <Button variant="outlined">Components</Button>
        <Button variant="outlined">Icons</Button>
        <IconButton onClick={this.toggleOpen}>
          <KeyboardArrowLeft />
        </IconButton>
      </div>
    ) : (
      <div style={typesStyle}>
        <IconButton onClick={this.toggleOpen}>
          <KeyboardArrowRight />
        </IconButton>
      </div>
    )
    const filteredComponents = this.filterComponents(components)
    const muiComponents = this.state.open
      ? Object.keys(filteredComponents.mui).map((name) => (
          <div key={`mui-${name}`} style={styles.component}>
            {name}
          </div>
        ))
      : null
    const htmlComponents = this.state.open
      ? Object.keys(filteredComponents.html).map((name) => (
          <div key={`html-${name}`} style={styles.component}>
            {name}
          </div>
        ))
      : null
    const rootStyle = this.state.open
      ? styles.root
      : {
          ...styles.root,
          maxWidth: 50,
          overflow: 'hidden',
        }
    const search = this.state.open ? (
      <div style={styles.search}>
        <TextField
          label="Search"
          style={styles.search.text}
          onChange={this.changeSearch}
        />
        <Paper style={styles.search.button} onClick={this.toggleCase}>
          {this.state.caseSensitive ? 'A' : 'a'}
        </Paper>
      </div>
    ) : null
    const fileControl = this.state.open ? (
      <Paper style={styles.file}>
        <Switch
          checked={!this.state.func}
          color="primary"
          onChange={this.toggleFunc}
        />
        Class Component
        <div style={styles.file.controls}>
          <Save />
          <Button variant="outlined" color="secondary">
            Load
          </Button>
          <Button variant="outlined">Export</Button>
        </div>
      </Paper>
    ) : null
    return (
      <div style={rootStyle}>
        {controls}
        {search}
        <div style={styles.components}>
          {muiComponents}
          {htmlComponents}
        </div>
        {fileControl}
      </div>
    )
  }
}

export default LeftPane
