import { Button, IconButton, Paper, Switch, TextField } from '@material-ui/core'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import React from 'react'

import components from '..'

import styles from './styles'

class LeftPane extends React.Component {
  state = {
    open: true,
  }

  toggleOpen = () => {
    this.setState({ open: !this.state.open })
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
    const muiComponents = this.state.open
      ? Object.keys(components.mui).map((name) => (
          <div key={`mui-${name}`} style={styles.component}>
            {name}
          </div>
        ))
      : null
    const htmlComponents = this.state.open
      ? Object.keys(components.html).map((name) => (
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
        <TextField label="Search" style={styles.search.text} />
        <Paper style={styles.search.button}>A</Paper>
      </div>
    ) : null
    const control = this.state.open ? (
      <Paper style={styles.file}>
        <Switch />
        Class Component
        <div style={styles.file.controls}>
          <Button variant="outlined" color="primary">
            Save
          </Button>
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
        {control}
      </div>
    )
  }
}

export default LeftPane
