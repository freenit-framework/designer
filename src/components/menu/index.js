import React from 'react'
import { withStore } from 'freenit'
import { List } from '@material-ui/core'

import { TreeItem } from 'components'

import styles from './styles'


class Menu extends React.Component {
  render() {
    return (
      <div style={styles.root}>
        <List component="div" disablePadding>
          <TreeItem data={this.props.store.tree.tree} />
        </List>
      </div>
    )
  }
}


Menu.propTypes = {
}


export default withStore(Menu)
