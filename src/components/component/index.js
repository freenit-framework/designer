import React from 'react'
// import PropTypes from 'prop-types'
import { useDrag } from 'react-dnd'
import components from '..'
import types from 'types'

// import styles from './styles'

const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
}


const Component = ({ name, handler }) => {
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
        handler(item)
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })
  const opacity = isDragging ? 0.4 : 1
  return (
    <div ref={drag} style={{ ...style, opacity }}>
      {name}
    </div>
  )
}


export default Component
