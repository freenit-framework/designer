import React from 'react'
import PropTypes from 'prop-types'
import { DndProvider } from 'react-dnd'
import { withStore } from 'freenit'
import Backend from 'react-dnd-html5-backend'
import KeyHandler, { KEYPRESS } from 'react-key-handler'
import {
  Component,
  DnD,
  Display,
  Editor,
} from 'components'

import initial from './initial'
import styles from './styles'


class Design extends React.Component {
  handleKeyboard = (event) => {
    this.props.store.design.remove()
  }

  render() {
    return (
      <DndProvider backend={Backend}>
        <KeyHandler
          keyEventName={KEYPRESS}
          keyValue="Delete"
          onKeyHandle={this.handleKeyboard}
        />
        <div style={styles.root}>
          <div style={styles.components}>
            <Component name="AppBar" />
            <Component name="Paper" />
          </div>
          <DnD identity={initial.tree.key}>
            <Display />
          </DnD>
          <Editor />
        </div>
      </DndProvider>
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
