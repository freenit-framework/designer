import React from 'react'
import PropTypes from 'prop-types'
import { withStore } from 'freenit'
import { List } from '@material-ui/core'

import { TreeItem } from 'components'

import styles from './styles'


class Menu extends React.Component {
  render() {
    return (
      <div style={styles.root}>
        <List component="div" disablePadding>
          <TreeItem data={this.props.store.design.tree} />
        </List>
      </div>
    )
  }
}


Menu.propTypes = {
  store: PropTypes.shape({
    design: PropTypes.shape({}).isRequired,
  }).isRequired,
}


export default withStore(Menu)
