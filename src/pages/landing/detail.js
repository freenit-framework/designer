import React from 'react'
import { withTheme } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'

import Template from 'templates/default/detail'
import styles from './styles'


class Landing extends React.Component {
  render() {
    return (
      <Template style={styles.root}>
        <h1>
          Freenit Framework
        </h1>
        <div style={styles.small}>
          Startkit for fast React development
        </div>
        <Button color="primary" variant="contained" style={styles.freenit}>
          Freenit
        </Button>
      </Template>
    )
  }
}


export default withTheme(Landing)
