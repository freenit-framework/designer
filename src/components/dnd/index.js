import React from 'react'
import PropTypes from 'prop-types'
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
  const ownProps = toProps(data.props)
  let style = {}
  if (ownProps.style) {
    if (typeof ownProps.style === 'object' && !Array.isArray(ownProps.style)) {
      style = { ...ownProps.style }
    }
  }
  if (canDrop && isOver) {
    style.border = '1px dashed green'
  } else if (store.design.selected.identity === identity) {
    style.border = '1px dashed red'
  }
  delete ownProps.style
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


DnD.propTypes = {
  data: PropTypes.shape({
    component: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({}),
    ]).isRequired,
    identity: PropTypes.number.isRequired,
    props: PropTypes.shape({}).isRequired,
  }).isRequired,
  store: PropTypes.shape({}).isRequired,
}


export default withStore(DnD)
