import React from 'react'
import { observer } from 'mobx-react'
import { List } from '@material-ui/core'

import store from 'store'
import TreeItem from './item'
import styles from './styles'

class Tree extends React.Component {
  render() {
    return (
      <div style={styles.root}>
        <List>
          <TreeItem data={store.design.tree} />
        </List>
      </div>
    )
  }
}

export default observer(Tree)
