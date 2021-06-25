import React from 'react'
import { useDrag } from 'react-dnd'

import styles from './styles'

const Drag = ({ data, children, title }) => {
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
  let view
  if (data.type === 'icon') {
    const Icon = data.component
    view = <Icon />
  } else {
    view = data.name
  }
  return (
    <div ref={drag} style={style} title={title}>
      {view}
    </div>
  )
}

export default Drag
