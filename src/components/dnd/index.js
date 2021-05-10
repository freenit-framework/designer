import React, { useRef } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { useDrag, useDrop } from 'react-dnd'
import store from 'store'
import { noChildrenComponents, textOnlyComponents, toProps } from 'components'
import types from 'types'

const DnD = ({ data, parent }) => {
  const { identity } = data
  const Component = data.component
  const { rearrange, selected, tree } = store
  const ref = useRef(null)
  const [over, setOver] = React.useState(false)
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: [types.COMPONENT, types.ICON],
    drop: (item, monitor) => {
      if (monitor.isOver({ shallow: true }) && monitor.canDrop()) {
        if (rearrange.rearrange) {
          tree.rearrange(item, parent, data)
        } else {
          const child = tree.add(item, data)
          selected.select(child)
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
  const ownProps = toProps(data.props)
  if (ownProps.style) {
    if (typeof ownProps.style === 'object' && !Array.isArray(ownProps.style)) {
      ownProps.style = { ...ownProps.style }
    } else {
      ownProps.style = {}
    }
  } else {
    ownProps.style = {}
  }
  if (canDrop && isOver) {
    ownProps.style.border = '2px dashed green'
  } else if (store.selected.selected.identity === identity) {
    ownProps.style.border = '2px dashed red'
  } else if (over) {
    ownProps.style.border = '1px dashed gray'
  }
  ownProps.style.opacity = isDragging ? 0 : 1
  drag(drop(ref))
  if (noChildrenComponents.includes(Component)) {
    return (
      <Component
        {...ownProps}
        ref={ref}
        onClick={(event) => {
          event.stopPropagation()
          store.selected.select(data)
        }}
        onMouseEnter={() => setOver(true)}
        onMouseLeave={() => setOver(false)}
      />
    )
  }
  if (textOnlyComponents.includes(Component)) {
    return (
      <Component
        {...ownProps}
        ref={ref}
        onClick={(event) => {
          event.stopPropagation()
          store.selected.select(data)
        }}
        onMouseEnter={() => setOver(true)}
        onMouseLeave={() => setOver(false)}
      >
        {data.text}
      </Component>
    )
  }
  return (
    <Component
      {...ownProps}
      ref={ref}
      onClick={(event) => {
        event.stopPropagation()
        store.selected.select(data)
      }}
      onMouseEnter={() => setOver(true)}
      onMouseLeave={() => setOver(false)}
    >
      {data.text}
      {data.children.map((item) => (
        <DnD data={item} store={store} key={item.identity} parent={data} />
      ))}
    </Component>
  )
}

const data = PropTypes.shape({
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})])
    .isRequired,
  identity: PropTypes.string.isRequired,
  props: PropTypes.shape({}).isRequired,
})

DnD.propTypes = {
  data: data.isRequired,
  parent: data,
}

export default observer(DnD)
