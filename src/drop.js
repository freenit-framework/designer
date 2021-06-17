import { action, toJS } from 'mobx'

import { defaultData } from 'components'
import store from 'store'
import { changeIds, compile } from 'utils'

const drop = (data, parent) => ({
  accept: ['html', 'mui', 'icon'],
  drop: action((item, monitor) => {
    if (monitor.isOver({ shallow: true }) && monitor.canDrop()) {
      const p = item.parent
      const sdata = JSON.stringify(toJS(item))
      const jdata = JSON.parse(sdata)
      const newone = jdata.parent === undefined
      delete jdata.parent
      if (newone) {
        const typeData = defaultData[jdata.type]
        const componentData = typeData ? typeData[jdata.name] : {}
        jdata.props = componentData && componentData.props ? componentData.props : compile({})
        jdata.children = componentData && componentData.children ? componentData.children : []
      }
      changeIds(jdata)
      if (p && Array.isArray(p.children)) {
        p.children = p.children.filter((child) => {
          return child.identity !== item.identity
        })
      }
      if (store.design.rearrange) {
        if (parent) {
          const index = parent.children.findIndex(
            (child) => child.identity === data.identity
          )
          if (index >= 0) {
            parent.children.splice(index, 0, jdata)
          }
        }
      } else {
        data.children.push(jdata)
      }
    }
  }),
  collect: (monitor) => ({
    isOver: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
  }),
})

export default drop
