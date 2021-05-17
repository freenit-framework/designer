import React from 'react'
import components from '..'

import styles from './styles'

class LeftPane extends React.Component {
  render() {
    const componentView = Object.keys(components.mui).map((name) => (
      <div key={`mui-${name}`} style={styles.component}>
        {name}
      </div>
    ))
    return <div style={styles.root}>{componentView}</div>
  }
}

export default LeftPane
