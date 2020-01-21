import React from 'react'
import PropTypes from 'prop-types'
import { withStore } from 'freenit'
import {
  Collapse,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core'
import DownIcon from '@material-ui/icons/KeyboardArrowDown'
import UpIcon from '@material-ui/icons/KeyboardArrowUp'

import TreeItem from '.'
import styles from './styles'


class Item extends React.Component {
  state = {
    open: false,
  }

  toggleOpen = (event) => {
    event.stopPropagation()
    this.setState({ open: !this.state.open })
  }

  select = (event) => {
    event.stopPropagation()
    const { store, data } = this.props
    store.design.setSelected(data)
    this.setState({ open: !this.state.open })
  }

  render() {
    const { data, store } = this.props
    const children = data.children.map(item => (
      <TreeItem data={item} parent={data} store={store} key={item.identity} />
    ))
    const icon = this.state.open
      ? <UpIcon style={styles.icon} />
      : <DownIcon style={styles.icon} />
    const style = {
      ...styles.root,
      border: data.identity === store.design.selected.identity
        ? '1px dashed gray'
        : styles.root.border
    }
    return (
      <ListItem button style={style} onClick={this.select}>
        <div style={styles.text}>
          <ListItemText
            primary={data.name}
            secondary={data.identity}
          />
          {icon}
        </div>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children}
          </List>
        </Collapse>
      </ListItem>
    )
  }
}


Item.propTypes = {
  data: PropTypes.shape({
  }).isRequired,
  store: PropTypes.shape({
    design: PropTypes.shape({}).isRequired,
  }).isRequired,
}


export default withStore(Item)
