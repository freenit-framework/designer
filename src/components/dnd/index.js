import React from 'react'
// import PropTypes from 'prop-types'
import { useDrop } from 'react-dnd'
import types from 'types'

// import styles from './styles'


const style = {
  height: '12rem',
  width: '12rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
}


const object2Components = (tree, hover, selected, onHover, onClick) =>  {
  return (
    <tree.component
      {...tree.props}
      key={tree.key}
      onMouseEnter={() => onHover(tree.key)}
      onMouseLeave={() => onHover(null)}
      onClick={(event) => {
        event.stopPropagation()
        console.log('clicked on', tree.key)
        if (onClick) {
          onClick(tree)
        }
      }}
    >
      {tree.text}
      {tree.children.map(el => object2Components(el, hover, selected, onHover))}
    </tree.component>
  )
}


const DnD = (props) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: types.COMPONENT,
    drop: () => ({ name: 'somedrop' }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })
  const isActive = canDrop && isOver
  let backgroundColor = '#222'
  if (isActive) {
    backgroundColor = 'darkgreen'
  } else if (canDrop) {
    backgroundColor = 'darkkhaki'
  }
  const content = object2Components(
    props.tree,
    props.hover,
    props.selected,
    props.onHover,
    props.onSelect,
)
  return (
    <div ref={drop} style={{ ...style, backgroundColor }}>
      {isActive ? 'Release to drop' : 'Drag a box here'}
      {content}
    </div>
  )
}


export default DnD
