import React from 'react'
// import PropTypes from 'prop-types'
import { useDrop } from 'react-dnd'
import { withStore } from 'freenit'
import { toProps } from 'components'
import types from 'types'


const DnD = ({ data, store }) => {
  const { identity } = data
  const Component = data.component
  const { design } = store
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
  } else if (store.design.selected.identity === identity) {
    style = { border: '1px dashed red' }
  } else {
    style = {}
  }
  const ownProps = toProps(data.props)
  return (
    <Component
      {...ownProps}
      ref={drop}
      style={{ ...ownProps.style, ...style }}
      onClick={(event) => {
        event.stopPropagation()
        store.design.onClick(data)
      }}
    >
      {data.identity}
      {data.text}
      {data.children.map(item => <DnD data={item} store={store} />)}
    </Component>
  )
}


export default withStore(DnD)
