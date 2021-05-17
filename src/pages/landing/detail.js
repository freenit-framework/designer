import React from 'react'
import { withTheme } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'

import { EmptyTemplate } from '@freenit-framework/core'
import store from 'store'
import styles from './styles'

class Landing extends React.Component {
  design = () => {
    store.history.push('/design')
  }

  render() {
    return (
      <EmptyTemplate.Detail style={styles.root}>
        <h1>Freenit Designer</h1>
        <div style={styles.small}>Design pages blazingly fast!</div>
        <Button
          color="primary"
          variant="contained"
          style={styles.freenit}
          onClick={this.design}
        >
          Design
        </Button>
      </EmptyTemplate.Detail>
    )
  }
}

export default withTheme(Landing)
