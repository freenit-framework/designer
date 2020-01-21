import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { useDrag, useDrop } from 'react-dnd'
import { withStore } from 'freenit'
import types from 'types'

import Item from './item'


const TreeItem = ({ data, parent, store }) => {
  const ref = useRef(null)
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: types.COMPONENT,
    drop: (item, monitor) => {
      if (monitor.isOver({ shallow:true }) && monitor.canDrop()) {
        if (store.design.rearranging) {
          store.design.rearrange(item, parent, data)
        } else {
          store.design.add(item, data)
        }
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  })
  const [{ isDragging }, drag] = useDrag({
    item: {
      ...data,
      type: types.COMPONENT,
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })
  const style = {}
  if (canDrop && isOver) {
    style.border = '1px dashed green'
  } else if (store.design.selected.identity === data.identity) {
    style.border = '1px dashed red'
  }
  style.opacity = isDragging ? 0.5 : 1
  drag(drop(ref))
  return (
    <div
      ref={ref}
      onClick={(event) => {
        event.stopPropagation()
        store.design.onClick(data)
      }}
      style={style}
    >
      <Item data={data} />
    </div>
  )
}


const data = PropTypes.shape({
  component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({}),
  ]).isRequired,
  identity: PropTypes.number.isRequired,
  props: PropTypes.shape({}).isRequired,
})


TreeItem.propTypes = {
  data: data.isRequired,
  parent: data,
  store: PropTypes.shape({}).isRequired,
}


export default withStore(TreeItem)
