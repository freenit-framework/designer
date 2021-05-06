import React from 'react'
import { useDrag } from 'react-dnd'
import store from 'store'
import types from 'types'

import styles from './styles'

const Component = ({ data }) => {
  const [{ isDragging }, drag] = useDrag({
    item: data,
    type: types.COMPONENT,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  })
  const opacity = isDragging ? 0.4 : 1
  return (
    <div ref={drag} style={{ ...styles.root, opacity }}>
      {data.name}
    </div>
  )
}

export default Component
