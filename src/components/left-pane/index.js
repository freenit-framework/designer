import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { Button, IconButton, Paper, TextField } from '@material-ui/core'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'

import { default as components, FileControls } from 'components'
import store from 'store'

import styles from './styles'

class LeftPane extends React.Component {
  state = {
    open: true,
    search: '',
    caseSensitive: true,
    tab: 'components',
  }

  toggleOpen = () => {
    this.setState({ open: !this.state.open })
  }

  toggleCase = () => {
    this.setState({ caseSensitive: !this.state.caseSensitive })
  }

  changeSearch = (event) => {
    this.setState({ search: event.target.value })
  }

  changeTab = (tab) => () => {
    this.setState({ tab })
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

  componentView = () => {
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
    return (
      <>
        {muiComponents}
        {htmlComponents}
      </>
    )
  }

  iconView = () => {
    return null
  }

  render() {
    const tabsStyle = this.state.open
      ? styles.tabs
      : {
          ...styles.tabs,
          overflow: 'hidden',
          justifyContent: 'flex-end',
        }
    const tabs = this.state.open ? (
      <div style={tabsStyle}>
        <Button variant="outlined" onClick={this.changeTab('components')}>
          Components
        </Button>
        <Button variant="outlined" onClick={this.changeTab('icons')}>
          Icons
        </Button>
        <IconButton onClick={this.toggleOpen}>
          <KeyboardArrowLeft />
        </IconButton>
      </div>
    ) : (
      <div style={tabsStyle}>
        <IconButton onClick={this.toggleOpen}>
          <KeyboardArrowRight />
        </IconButton>
      </div>
    )
    const componentView =
      this.state.tab === 'components' ? this.componentView() : this.iconView()
    const rootStyle = this.state.open
      ? styles.root
      : {
          ...styles.root,
          maxWidth: 50,
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
    const fileControl = this.state.open ? <FileControls /> : null
    return (
      <div style={rootStyle}>
        {tabs}
        {search}
        <div style={styles.components}>{componentView}</div>
        {fileControl}
      </div>
    )
  }
}

export default observer(LeftPane)
