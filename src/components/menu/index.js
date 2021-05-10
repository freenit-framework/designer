import React from 'react'
import { observer } from 'mobx-react'
import { List } from '@material-ui/core'

import store from 'store'
import { TreeItem } from 'components'

import styles from './styles'

class Menu extends React.Component {
  render() {
    return (
      <div style={styles.root}>
        <List component="div" disablePadding>
          <TreeItem data={store.tree.tree} />
        </List>
      </div>
    )
  }
}

export default observer(Menu)
