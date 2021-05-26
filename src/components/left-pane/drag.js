import React from 'react'
import { toJS } from 'mobx'
import { useDrag } from 'react-dnd'

import styles from './styles'

const Drag = ({ data }) => {
  const [{ isDragging }, drag] = useDrag({
    item: data,
    type: data.type,
    collect: (monitor) => {
      const isDragging = monitor.isDragging()
      return { isDragging }
    },
  })
  const opacity = isDragging ? 0.4 : 1
  const style = { ...styles.component, opacity }
  return (
    <div ref={drag} style={style}>
      {data.name}
    </div>
  )
}

export default Drag
