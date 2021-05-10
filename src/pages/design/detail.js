import React from 'react'
import { observer } from 'mobx-react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend as Backend } from 'react-dnd-html5-backend'
import { ComponentPanel, Editor, Renderer } from 'components'
import types from 'types'
import * as icons from '@material-ui/icons'
import * as mui from '@material-ui/core'
import { changeIds, exportJson } from 'utils'
import store from 'store'

import styles from './styles'

class Design extends React.Component {
  handleKeyDown = async (event) => {
    const { clipboard, rearrange, selected, tree } = store
    if (event.key === 'Shift') {
      rearrange.rearrange = true
    } else if (event.key === 'Delete') {
      tree.remove(selected.selected)
    } else if (event.key === 'Control') {
      clipboard.control(true)
    } else if (clipboard.clipboard.ctrl && event.key === 'c') {
      const listener = function (ev) {
        ev.preventDefault()
        const data = exportJson(selected.selected)
        const display = JSON.stringify(data)
        if (display !== {}) {
          ev.clipboardData.setData('text/plain', display)
        }
      }
      document.addEventListener('copy', listener)
      document.execCommand('copy')
      document.removeEventListener('copy', listener)
    } else if (clipboard.clipboard.ctrl && event.key === 'v') {
      const input = document.getElementById('pasteFromClipboard')
      input.value = ''
      input.focus()
      input.select()
      document.execCommand('paste')
    }
  }

  handleKeyUp = (event) => {
    const { clipboard, rearrange } = store
    if (event.key === 'Shift') {
      rearrange.rearrange = false
    } else if (event.key === 'Control') {
      clipboard.control(false)
    }
  }

  loadData = (data) => {
    const result = { ...data }
    result.name = result.component
    if (result.type === types.ICON) {
      result.component = icons[result.name]
    } else {
      result.component = mui[result.name] || result.name
    }
    result.children = result.children.map((item) => this.loadData(item))
    return result
  }

  handlePaste = (event) => {
    const { selected, tree } = store
    const { value } = event.target
    if (selected.selected !== {} && value !== '') {
      const pasted = JSON.parse(value)
      const changedData = changeIds(pasted)
      const data = this.loadData(changedData)
      tree.add(data, selected.selected)
    }
  }

  render() {
    const { display, tree } = store
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
            <Renderer data={tree.tree} type={display.display} />
          </div>
          <Editor />
        </DndProvider>
      </div>
    )
  }
}

export default observer(Design)
