import React from 'react'
import { IconButton, Paper } from '@material-ui/core'
import { DesktopMac, PhoneAndroid, Tablet } from '@material-ui/icons'

import store from 'store'
import styles from './styles'

class Device extends React.Component {
  setDevice = (device) => () => {
    store.design.setDevice(device)
  }

  render() {
    return (
      <Paper style={styles.root}>
        <IconButton onClick={this.setDevice('mobile')}>
          <PhoneAndroid />
        </IconButton>
        <IconButton onClick={this.setDevice('tablet')}>
          <Tablet />
        </IconButton>
        <IconButton onClick={this.setDevice('desktop')}>
          <DesktopMac />
        </IconButton>
      </Paper>
    )
  }
}

export default Device
