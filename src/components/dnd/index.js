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
    ownProps.style.border = '1px dashed green'
  } else if (store.design.selected.identity === identity) {
    ownProps.style.border = '1px dashed red'
  }
  return (
    <Component
      {...ownProps}
      ref={drop}
      onClick={(event) => {
        event.stopPropagation()
        store.design.onClick(data)
      }}
    >
      {data.text}
      {data.children.map(
        item => <DnD data={item} store={store} key={item.identity} />
      )}
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
