import React from 'react'
import { useDrag } from 'react-dnd'
import { withStore } from 'freenit'
import { compile } from 'components'
import types from 'types'


const Icon = ({ icon, store }) => {
  const [{ isDragging }, drag] = useDrag({
    item: compile({
      name: icon.name,
      component: icon,
      children: [],
      props: {},
      type: types.ICON,
    }),
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })
  const opacity = isDragging ? 0.4 : 1
  const IconData = icon
  return (
    <div ref={drag}>
      <IconData style={{ opacity }} />
    </div>
  )
}


export default withStore(Icon)
