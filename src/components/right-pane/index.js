import React from 'react'
import { Button } from '@material-ui/core'

import store from 'store'
import styles from './styles'

class RightPane extends React.Component {
  change = () => {
    store.design.change()
  }

  render() {
    return (
      <div style={styles.root}>
        <Button onClick={this.change}>change</Button>
      </div>
    )
  }
}

export default RightPane
