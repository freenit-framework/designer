import React from 'react'
import { withStore } from 'freenit'
import {
  Menu,
  Props,
  ThemeEditor,
} from 'components'
import {
  IconButton,
  Button,
  Paper,
} from '@material-ui/core'

import {
  DesktopMac,
  FormatIndentIncrease,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  PhoneAndroid,
  Redo,
  Search,
  Tablet,
  Undo,
} from '@material-ui/icons'

import styles from './styles'


const tabLabels = [
  'props',
  'theme',
]


class Editor extends React.Component {
  state = {
    open: true,
    tab: 'props'
  }

  toggleHide = () => {
    this.setState({ open: !this.state.open })
  }

  switchTab = (tab) => () => {
    this.setState({ tab })
  }

  toggleRearrange = () => {
    const { rearrange } = this.props.store
    rearrange.rearrange = !rearrange.rearrange
  }

  undo = () => {}
  redo = () => {}
  find = () => {
    const { tree, selected } = this.props.store
    tree.showSelected(selected.selected)
    this.setState({ tab: this.state.tab })
  }

  setDisplay = (display) => () => {
    this.props.store.display.display = display
  }

  render() {
    const icon = this.state.open ? <KeyboardArrowRight /> : <KeyboardArrowLeft />
    const rootStyle = this.state.open
      ? styles.root
      : { ...styles.root, width: 50 }
    const tabs = this.state.open
      ? tabLabels.map(label => (
        <Button
          key={label}
          style={styles.button}
          variant="outlined"
          onClick={this.switchTab(label)}
          disabled={label === this.state.tab}
        >
          {label}
        </Button>
      )) : null
    let content
    let actions
    if (this.state.open) {
      const color = this.props.store.rearrange.rearrange
        ? 'secondary'
        : 'default'
      actions = (
        <div style={styles.rearrange}>
          <IconButton
            color={color}
            variant="outlined"
            onClick={this.toggleRearrange}
          >
            <FormatIndentIncrease />
          </IconButton>
          <IconButton
            onClick={this.undo}
          >
            <Undo />
          </IconButton>
          <IconButton
            onClick={this.redo}
          >
            <Redo />
          </IconButton>
          <IconButton
            onClick={this.find}
          >
            <Search />
          </IconButton>
        </div>
      )
      if (this.state.tab === 'props') {
        content = (
          <div style={styles.content}>
            <Menu />
            <Props />
          </div>
        )
      }
      if (this.state.tab === 'theme') {
        content = (
          <div style={styles.content}>
            <ThemeEditor />
          </div>
        )
      }
    }
    return (
      <Paper style={rootStyle}>
        <div style={styles.buttons}>
          <IconButton onClick={this.toggleHide}>{icon}</IconButton>
          {tabs}
        </div>
        {actions}
        {content}
        <div style={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: 'white' }}>
          <IconButton onClick={this.setDisplay('mobile')}>
            <PhoneAndroid />
          </IconButton>
          <IconButton onClick={this.setDisplay('tablet')}>
            <Tablet />
          </IconButton>
          <IconButton onClick={this.setDisplay('desktop')}>
            <DesktopMac />
          </IconButton>
        </div>
      </Paper>
    )
  }
}


export default withStore(Editor)
