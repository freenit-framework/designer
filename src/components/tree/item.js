import React from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons'

import store from 'store'
import styles from './styles'

const TreeItem = observer(
  class Item extends React.Component {
    select = (event) => {
      event.stopPropagation()
      const { data } = this.props
      store.design.setSelected(data)
    }

    toggleOpen = action((event) => {
      event.stopPropagation()
      const { data } = this.props
      data.opened = !data.opened
    })

    render() {
      const { data } = this.props
      const { selected } = store.design
      const children = data.children.map((item) => (
        <TreeItem data={item} key={item.identity} />
      ))
      const icon = data.opened ? <KeyboardArrowUp /> : <KeyboardArrowDown />
      const style = {
        ...styles.item,
        border: data.identity === selected.identity ? '1px dashed gray' : null,
      }
      return (
        <ListItem button style={style} onClick={this.select}>
          <div style={styles.text}>
            <ListItemText primary={data.name} secondary={data.identity} />
            <IconButton onClick={this.toggleOpen}>{icon}</IconButton>
          </div>
          <Collapse in={data.opened} timeout="auto">
            <List component="div" disablePadding>
              {children}
            </List>
          </Collapse>
        </ListItem>
      )
    }
  }
)

export default TreeItem
