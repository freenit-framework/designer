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

import styles from './styles'


class Design extends React.Component {
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

  render() {
    return (
      <div
        style={styles.root}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
        tabIndex="0"
      >
        <DndProvider backend={Backend}>
          <div style={styles.components}>
            {components.map(
              data => <Component data={data} key={data.identity} />
            )}
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
