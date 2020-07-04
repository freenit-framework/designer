import React from 'react'
import { withStore } from 'freenit'
import {
  Menu,
  Props,
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
  'files',
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
    if (this.state.open) {
      content = this.state.tab === 'props'
        ? (
          <div style={styles.content}>
            <Menu />
            <Props />
          </div>
        ) : null
    }
    return (
      <Paper style={rootStyle}>
        <div style={styles.buttons}>
          <IconButton onClick={this.toggleHide}>{icon}</IconButton>
          {tabs}
        </div>
        {content}
      </Paper>
    )
  }
}


export default withStore(Editor)
