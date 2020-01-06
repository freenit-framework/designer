import React from 'react'
// import PropTypes from 'prop-types'
import { useDrag } from 'react-dnd'
import components from '..'
import types from 'types'

import styles from './styles'


const Component = ({ name, add, hover, select }) => {
  const component = components[name]
  const [{ isDragging }, drag] = useDrag({
    item: {
      ...component,
      name,
      type: types.COMPONENT,
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult()
      if (item && dropResult) {
        add(item)
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })
  const opacity = isDragging ? 0.4 : 1
  return (
    <div ref={drag} style={{ ...styles.root, opacity }}>
      {name}
    </div>
  )
}


export default Component
