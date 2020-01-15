import React from 'react'
// import PropTypes from 'prop-types'
import { useDrop } from 'react-dnd'
import { withStore } from 'freenit'
import types from 'types'


const DnD = (props) => {
  const { identity } = props
  const { design } = props.store
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: types.COMPONENT,
    drop: (item, monitor) => {
      if (monitor.isOver({ shallow:true }) && monitor.canDrop()) {
        design.add(item, identity)
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  })
  let style
  if (canDrop && isOver) {
    style = { border: '1px dashed green' }
  } else if (props.store.design.selected.identity === identity) {
    style = { border: '1px dashed red' }
  } else {
    style = null
  }
  return (
    <div ref={drop} style={style}>
      {props.children}
    </div>
  )
}


export default withStore(DnD)
