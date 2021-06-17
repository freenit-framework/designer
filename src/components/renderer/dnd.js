import React from 'react'
import { action, toJS } from 'mobx'
import { useDrag, useDrop } from 'react-dnd'

import { makeid } from 'utils'
import components, { noChildrenComponents, textOnlyComponents } from 'components'
import store from 'store'
import dropData from 'drop'
import Renderer from './index'

const DnD = ({ props, style, data, parent }) => {
  const ref = React.useRef(null)
  const { type, name, children, text } = data
  const comps = components[type]
  if (!comps) {
    return null
  }
  const Component = comps[name].component
  const accept = Object.keys(components)
  const [{ canDrop, isOver }, drop] = useDrop(dropData(data, parent))
  const [{ isDragging }, drag] = useDrag({
    item: { ...data, parent },
    type: data.type,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  })
  drag(drop(ref))
  const myStyle = { ...style }
  if (canDrop && isOver) {
    myStyle.borderStyle = 'dashed'
    myStyle.borderWidth = 2
    myStyle.borderColor = 'green'
  }
  let view
  if (noChildrenComponents.includes(name)) {
    view = (
      <Component {...props} style={myStyle} ref={ref} />
    )
  } else if (textOnlyComponents.includes(name)) {
    view = (
      <Component {...props} style={myStyle} ref={ref}>
        {text}
      </Component>
    )
  } else {
    view = (
      <Component {...props} style={myStyle} ref={ref}>
        {text}
        {children.map((child) => (
          <Renderer data={child} key={child.identity} parent={data} />
        ))}
      </Component>
    )
  }
  return view
}

export default DnD
