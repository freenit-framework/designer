import React from 'react'
// import PropTypes from 'prop-types'
import { useDrop } from 'react-dnd'
import types from 'types'

import styles from './styles'


const object2Components = (tree, hover, selected, onHover, onClick) =>  {
  const style = selected.key === tree.key
    ? ({
      ...tree.props.style,
      border: '1px dashed red',
    }) : tree.props.style
  return (
    <tree.component
      {...tree.props}
      key={tree.key}
      style={style}
      onMouseEnter={() => onHover(tree.key)}
      onMouseLeave={() => onHover(null)}
      onClick={(event) => {
        event.stopPropagation()
        onClick(tree)
      }}
    >
      {tree.text}
      {tree.children.map(el => object2Components(
        el,
        hover,
        selected,
        onHover,
        onClick,
      ))}
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
    <div ref={drop} style={{ ...styles.component, backgroundColor }}>
      {isActive ? 'Release to drop' : 'Drag a box here'}
      {content}
    </div>
  )
}


export default DnD
