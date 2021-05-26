import React from 'react'
import { action, toJS } from 'mobx'
import { useDrag, useDrop } from 'react-dnd'

import { makeid } from 'utils'
import components from 'components'
import store from 'store'
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
  const [{ canDrop, isOver }, drop] = useDrop({
    accept,
    drop: action((item, monitor) => {
      if (monitor.isOver({ shallow: true }) && monitor.canDrop()) {
        const { parent } = item
        const sdata = JSON.stringify(toJS(item))
        const jdata = JSON.parse(sdata)
        jdata.identity = makeid(8)
        if (parent && Array.isArray(parent.children)) {
          parent.children = parent.children.filter((child) => {
            return child.identity !== item.identity
          })
        }
        data.children.push(jdata)
      }
    }),
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  })
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
  return (
    <Component {...props} style={myStyle} ref={ref}>
      {text}
      {children.map((child) => (
        <Renderer data={child} key={child.identity} parent={data} />
      ))}
    </Component>
  )
}

export default DnD
