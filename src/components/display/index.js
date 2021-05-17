import React from 'react'

import { Renderer } from 'components'
import store from 'store'

import styles from './styles'

class Display extends React.Component {
  render() {
    return (
      <div style={styles.root}>
        <Renderer data={store.design.tree} />
      </div>
    )
  }
}

export default Display
