import React, { useRef } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { useDrag, useDrop } from 'react-dnd'
import store from 'store'
import types from 'types'

import Item from './item'

const TreeItem = ({ data, parent }) => {
  const ref = useRef(null)
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: [types.COMPONENT, types.ICON],
    drop: (item, monitor) => {
      if (monitor.isOver({ shallow: true }) && monitor.canDrop()) {
        if (store.rearrange.rearrange) {
          store.tree.rearrange(item, parent, data)
        } else {
          store.tree.add(item, data)
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  })
  const [{ isDragging }, drag] = useDrag({
    item: data,
    type: types.COMPONENT,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  })
  const style = {}
  if (canDrop && isOver) {
    style.border = '1px dashed green'
  } else if (store.selected.selected.identity === data.identity) {
    style.border = '1px dashed red'
  }
  style.opacity = isDragging ? 0.5 : 1
  drag(drop(ref))
  return (
    <div
      ref={ref}
      onClick={(event) => {
        event.stopPropagation()
        store.selected.select(data)
      }}
      style={style}
    >
      <Item data={data} />
    </div>
  )
}

const data = PropTypes.shape({
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})])
    .isRequired,
  identity: PropTypes.string.isRequired,
  props: PropTypes.shape({}).isRequired,
})

TreeItem.propTypes = {
  data: data.isRequired,
  parent: data,
}

export default observer(TreeItem)
