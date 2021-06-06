import React from 'react'
import { action, toJS } from 'mobx'
import { observer } from 'mobx-react'

import components from 'components'
import { changeIds } from 'utils'
import store from 'store'

import styles from './styles'

class KeyBind extends React.Component {
  handleKeyDown = action((event) => {
    const { design } = store
    if (event.key === 'Shift') {
      design.rearrange = true
    } else if (event.key === 'Delete') {
      design.remove(design.selected)
    } else if (event.key === 'Control') {
      design.keybind.ctrl = true
    } else if (design.keybind.ctrl && event.key === 'c') {
      const data = toJS(design.selected)
      const input = document.getElementById('copyToClipboard')
      const value = JSON.stringify(data)
      input.value = value
      input.focus()
      input.select()
      document.execCommand('copy')
    } else if (design.keybind.ctrl && event.key === 'v') {
      const input = document.getElementById('pasteFromClipboard')
      input.value = ''
      input.focus()
      input.select()
      document.execCommand('paste')
    }
  })

  handleKeyUp = action((event) => {
    if (event.key === 'Shift') {
      store.design.rearrange = false
    } else if (event.key === 'Control') {
      store.design.keybind.ctrl = false
    }
  })

  handlePaste = action((event) => {
    const { selected, setSelected } = store.design
    if (!selected.identity) {
      return
    }
    const { value } = event.target
    if (selected.identity && value !== '') {
      const pasted = JSON.parse(value)
      const changedData = changeIds(pasted)
      const last = selected.children.length
      selected.children.push(changedData)
      setSelected(selected.children[last])
    }
  })

  render() {
    return (
      <div
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
        tabIndex="0"
      >
        <input type="text" id="copyToClipboard" style={styles.input} />
        <input
          type="text"
          id="pasteFromClipboard"
          style={styles.input}
          onChange={this.handlePaste}
        />
        {this.props.children}
      </div>
    )
  }
}

export default observer(KeyBind)
