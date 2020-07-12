import React from 'react'
import { DndProvider } from 'react-dnd'
import { withStore } from 'freenit'
import Backend from 'react-dnd-html5-backend'
import {
  ComponentPanel,
  Display,
  Editor,
} from 'components'

import styles from './styles'


class Design extends React.Component {
  handleKeyDown = (event) => {
    const { rearrange, selected, tree } = this.props.store
    if (event.key === 'Shift') {
      rearrange.setRearrange(true)
    } else if (event.key === 'Delete') {
      tree.remove(selected.selected)
    }
  }

  handleKeyUp = (event) => {
    const { rearrange } = this.props.store
    if (event.key === 'Shift') {
      rearrange.setRearrange(false)
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
        <DndProvider backend={Backend} style={styles.provider}>
          <ComponentPanel />
          <div style={styles.display}>
            <Display />
          </div>
          <Editor />
        </DndProvider>
      </div>
    )
  }
}


Design.propTypes = {
}


export default withStore(Design)
