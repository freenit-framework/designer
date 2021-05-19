import React from 'react'
import { observer } from 'mobx-react'

import styles from './styles'

class Props extends React.Component {
  render() {
    return <div style={styles.root}></div>
  }
}

export default observer(Props)
