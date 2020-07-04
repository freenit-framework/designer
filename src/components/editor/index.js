import React from 'react'
import { withStore } from 'freenit'
import {
  Menu,
  Props,
} from 'components'
import {
  IconButton,
  Paper,
} from '@material-ui/core'

import LeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import RightIcon from '@material-ui/icons/KeyboardArrowRight'

import styles from './styles'


class Editor extends React.Component {
  state = {
    open: true,
  }

  toggleHide = () => {
    this.setState({ open: !this.state.open })
  }

  render() {
    const icon = this.state.open ? <RightIcon /> : <LeftIcon />
    const rootStyle = this.state.open
      ? styles.root
      : { ...styles.root, width: 50 }
    const content = this.state.open
      ? (
        <div style={styles.content}>
          <Menu />
          <Props />
        </div>
      ) : null
    return (
      <Paper style={rootStyle}>
        <div style={styles.toggle}>
          <IconButton onClick={this.toggleHide}>{icon}</IconButton>
        </div>
        {content}
      </Paper>
    )
  }
}

export default withStore(Editor)
