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
  handleKeyDown = async (event) => {
    const { clipboard, rearrange, selected, tree } = this.props.store
    if (event.key === 'Shift') {
      rearrange.setRearrange(true)
    } else if (event.key === 'Delete') {
      tree.remove(selected.selected)
    } else if (event.key === 'Control') {
      clipboard.control(true)
    } else if (clipboard.clipboard.ctrl && event.key === 'c') {
      const listener = function(ev) {
        ev.preventDefault()
        const display = JSON.stringify(selected.selected)
        if (display !== {}) {
          ev.clipboardData.setData('text/plain', display)
        }
      }
      document.addEventListener('copy', listener)
      document.execCommand('copy')
      document.removeEventListener('copy', listener)
    } else if (clipboard.clipboard.ctrl && event.key === 'v') {
      const input = document.getElementById('pasteFromClipboard')
      input.focus()
      input.select()
      document.execCommand('paste')
    }
  }

  handleKeyUp = (event) => {
    const { clipboard, rearrange } = this.props.store
    if (event.key === 'Shift') {
      rearrange.setRearrange(false)
    } else if (event.key === 'Control') {
      clipboard.control(false)
    }
  }

  handlePaste = (event) => {
    const { selected, tree } = this.props.store
    if (selected.selected !== {}) {
      const pasted = JSON.parse(event.target.value)
      tree.add(pasted, selected.selected)
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
        <input
          type="text"
          id="pasteFromClipboard"
          style={styles.paste}
          onChange={this.handlePaste}
        />
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


export default withStore(Design)
