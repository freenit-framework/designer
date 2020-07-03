import React from 'react'
import PropTypes from 'prop-types'
import { DndProvider } from 'react-dnd'
import { withStore } from 'freenit'
import Backend from 'react-dnd-html5-backend'
import {
  default as components,
  Component,
  Display,
  Editor,
} from 'components'
import {
  Button,
  Paper,
  TextField,
} from '@material-ui/core'

import styles from './styles'


class Design extends React.Component {
  state = {
    caseSensitive: true,
    search: '',
  }

  handleKeyDown = (event) => {
    const { design } = this.props.store
    if (event.key === 'Shift') {
      design.setRearranging(true)
    } else if (event.key === 'Delete') {
      design.remove()
    }
  }

  handleKeyUp = (event) => {
    const { design } = this.props.store
    if (event.key === 'Shift') {
      design.setRearranging(false)
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

  toggleCase = () => {
    this.setState({ caseSensitive: !this.state.caseSensitive })
  }

  render() {
    const caseText = this.state.caseSensitive
      ? 'A'
      : 'a'
    return (
      <div
        style={styles.root}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
        tabIndex="0"
      >
        <DndProvider backend={Backend} style={styles.provider}>
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
            <div style={styles.components.container}>
              <a href="">
                <Button style={styles.components.button} variant="outlined">
                  Load
                </Button>
              </a>
              <a href="">
                <Button style={styles.components.button} variant="outlined">
                  Save
                </Button>
              </a>
              <a href="">
                <Button style={styles.components.button} variant="outlined">
                  Export
                </Button>
              </a>
            </div>
          </div>
          <Display />
          <Editor />
        </DndProvider>
      </div>
    )
  }
}


Design.propTypes = {
  store: PropTypes.shape({
    design: PropTypes.shape({
      remove: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
}


export default withStore(Design)
