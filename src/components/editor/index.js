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

import LeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import RightIcon from '@material-ui/icons/KeyboardArrowRight'

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
    rearrange.setRearrange(!rearrange.rearrange)
  }

  render() {
    const icon = this.state.open ? <RightIcon /> : <LeftIcon />
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
    let rearrange
    if (this.state.open) {
      const color = this.props.store.rearrange.rearrange
        ? 'secondary'
        : 'default'
      rearrange = (
        <div style={styles.rearrange}>
          <Button
            color={color}
            variant="outlined"
            onClick={this.toggleRearrange}
          >
            Rearrange
          </Button>
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
        {rearrange}
        {content}
      </Paper>
    )
  }
}


export default withStore(Editor)
