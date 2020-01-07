import React from 'react'
import { withStore } from 'freenit'
import {
  Menu,
  Props,
} from 'components'

import styles from './styles'


class Editor extends React.Component {
  render() {
    return (
      <div style={styles.root}>
        <Menu />
        <Props />
      </div>
    )
  }
}

export default withStore(Editor)
