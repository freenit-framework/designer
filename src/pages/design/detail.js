import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend as Backend } from 'react-dnd-html5-backend'
import { EmptyTemplate } from '@freenit-framework/core'

import { Display, LeftPane, RightPane } from 'components'
import styles from './styles'

class Design extends React.Component {
  render() {
    return (
      <EmptyTemplate.Detail style={styles.root}>
        <DndProvider backend={Backend} style={styles.provider}>
          <LeftPane />
          <Display />
          <RightPane />
        </DndProvider>
      </EmptyTemplate.Detail>
    )
  }
}

export default Design
