import React from 'react'
import { EmptyTemplate } from '@freenit-framework/core'

import { Display, LeftPane, RightPane } from 'components'
import styles from './styles'

class Design extends React.Component {
  render() {
    return (
      <EmptyTemplate.Detail style={styles.root}>
        <LeftPane />
        <Display />
        <RightPane />
      </EmptyTemplate.Detail>
    )
  }
}

export default Design
