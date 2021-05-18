import React from 'react'
import { observer } from 'mobx-react'

import { Renderer } from 'components'
import store from 'store'
import styles from './styles'

class Display extends React.Component {
  render() {
    const { device } = store.design
    const style = styles[device] || styles.default
    return (
      <div style={styles.root}>
        <div style={style}>
          <Renderer data={store.design.tree} />
        </div>
      </div>
    )
  }
}

export default observer(Display)
