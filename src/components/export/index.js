import React from 'react'
import { withStore } from 'freenit'

import styles from './styles'


class Export extends React.Component {
  render() {
    return (
      <div style={styles.root}>
        Export
      </div>
    )
  }
}

export default withStore(Export)
