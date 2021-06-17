import React from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import { Button, IconButton } from '@material-ui/core'
import {
  FormatIndentIncrease,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Redo,
  Search,
  Undo,
} from '@material-ui/icons'

import store from 'store'
import { Device, Props, Tree } from 'components'
import styles from './styles'

class RightPane extends React.Component {
  state = {
    open: true,
    tab: 'props',
  }

  undo = () => {}
  redo = () => {}
  toggleOpen = () => this.setState({ open: !this.state.open })
  toggleRearrange = () => store.design.setRearrange(!store.design.rearrange)
  changeTab = (tab) => () => this.setState({ tab })

  _find = action((item = store.design.tree) => {
    if (item.identity === store.design.selected.identity) {
      item.opened = true
      return true
    }
    item.opened = item.children.reduce(
      (result, child) => result || this._find(child),
      false
    )
    return item.opened
  })

  find = () => this._find()

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
        <IconButton onClick={this.toggleOpen}>
          <KeyboardArrowRight />
        </IconButton>
        <Button
          variant="outlined"
          style={styles.props}
          onClick={this.changeTab('props')}
          disabled={this.state.tab === 'props'}
        >
          Props
        </Button>
        <Button
          variant="outlined"
          onClick={this.changeTab('theme')}
          disabled={this.state.tab === 'theme'}
        >
          Theme
        </Button>
      </div>
    ) : (
      <div style={tabsStyle}>
        <IconButton onClick={this.toggleOpen}>
          <KeyboardArrowLeft />
        </IconButton>
      </div>
    )
    const rootStyle = this.state.open
      ? styles.root
      : {
          ...styles.root,
          maxWidth: 50,
        }
    const device = this.state.open ? <Device /> : null
    const color = store.design.rearrange ? 'secondary' : 'default'
    const actions = this.state.open ? (
      <div style={styles.actions}>
        <IconButton
          color={color}
          variant="outlined"
          onClick={this.toggleRearrange}
        >
          <FormatIndentIncrease />
        </IconButton>
        <IconButton onClick={this.undo}>
          <Undo />
        </IconButton>
        <IconButton onClick={this.redo}>
          <Redo />
        </IconButton>
        <IconButton onClick={this.find}>
          <Search />
        </IconButton>
      </div>
    ) : null
    const editor = this.state.open ? (
      <div style={styles.edit}>
        {this.state.tab === 'props' ? <Tree /> : null}
        <Props source={this.state.tab} />
      </div>
    ) : null
    return (
      <div style={rootStyle}>
        {tabs}
        {actions}
        {editor}
        {device}
      </div>
    )
  }
}

export default observer(RightPane)
