import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { useDrag, useDrop } from 'react-dnd'
import { withStore } from 'freenit'
import { toProps } from 'components'
import types from 'types'


const DnD = ({ data, parent, store }) => {
  const { identity } = data
  const Component = data.component
  const { design } = store
  const ref = useRef(null)
  const [ over, setOver ] = React.useState(false)
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: types.COMPONENT,
    drop: (item, monitor) => {
      if (monitor.isOver({ shallow:true }) && monitor.canDrop()) {
        if (design.rearranging) {
          design.rearrange(item, parent, data)
        } else {
          design.add(item, data)
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
  } else if (store.design.selected.identity === identity) {
    ownProps.style.border = '2px dashed red'
  } else if (over) {
    ownProps.style.border = '1px dashed gray'
  }
  ownProps.style.opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return (
    <Component
      {...ownProps}
      ref={ref}
      onClick={(event) => {
        event.stopPropagation()
        store.design.onClick(data)
      }}
      onMouseEnter={() => setOver(true)}
      onMouseLeave={() => setOver(false)}
    >
      {data.text}
      {data.children.map(item => (
        <DnD
          data={item}
          store={store}
          key={item.identity}
          parent={data}
        />
      ))}
    </Component>
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


DnD.propTypes = {
  data: data.isRequired,
  parent: data,
  store: PropTypes.shape({}).isRequired,
}


export default withStore(DnD)
