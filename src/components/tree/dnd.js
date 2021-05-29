import { IconButton, ListItemText } from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons'
import { action, toJS } from 'mobx'
import React from 'react'
import { useDrag, useDrop } from 'react-dnd'

import styles from './styles'
import dropData from 'drop'

const DnD = ({ data, parent, toggleOpen }) => {
  const ref = React.useRef(null)
  const icon = data.opened ? <KeyboardArrowUp /> : <KeyboardArrowDown />
  const { identity, type, name } = data
  const [{ canDrop, isOver }, drop] = useDrop(dropData(data, parent))
  const [{ isDragging }, drag] = useDrag({
    item: { ...data, parent },
    type: data.type,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  })
  drag(drop(ref))
  const myStyle = { ...styles.text }
  if (canDrop && isOver) {
    myStyle.borderStyle = 'dashed'
    myStyle.borderWidth = 2
    myStyle.borderColor = 'green'
  }
  return (
    <div style={myStyle} ref={ref}>
      <ListItemText primary={name} secondary={identity} />
      <IconButton onClick={toggleOpen}>{icon}</IconButton>
    </div>
  )
}

export default DnD
