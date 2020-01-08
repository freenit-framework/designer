import React from 'react'
// import PropTypes from 'prop-types'
import { useDrop } from 'react-dnd'
import { withStore } from 'freenit'
import {
  DnDOver,
} from 'components'
import types from 'types'


const DnD = (props) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: types.COMPONENT,
    drop: (item) => {
      props.store.design.add(item, props.identity)
    },
    collect: monitor => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  })
  const active = canDrop && isOver
  let backgroundColor
  if (active) {
    backgroundColor = 'darkgreen'
  } else if (canDrop) {
    backgroundColor = 'darkkhaki'
  }
  return (
    <div ref={drop} style={{ backgroundColor }}>
      <DnDOver
        identity={props.identity}
        active={active}
        canDrop={canDrop}
        isOver={isOver}
      />
      {props.children}
    </div>
  )
}


export default withStore(DnD)
