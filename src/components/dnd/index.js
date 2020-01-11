import React from 'react'
// import PropTypes from 'prop-types'
import { useDrop } from 'react-dnd'
import { withStore } from 'freenit'
import {
  DnDOver,
} from 'components'
import types from 'types'


const DnD = (props) => {
  const [{ isOver }, drop] = useDrop({
    accept: types.COMPONENT,
    drop: () => ({ identity: props.identity }),
    collect: monitor => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  })
  return (
    <div ref={drop}>
      <DnDOver
        identity={props.identity}
        isOver={isOver}
      />
      {props.children}
    </div>
  )
}


export default withStore(DnD)
