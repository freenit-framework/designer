import components from 'components'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'

import store from 'store'
import styles from './styles'

const overStyle = { borderStyle: 'dotted', borderWidth: 1 }

const Renderer = observer(
  class Ren extends React.Component {
    state = {
      style: {},
    }

    mouseOver = (event) => {
      event.stopPropagation()
      store.design.setOver(this.props.data)
    }

    mouseLeave = () => {
      event.stopPropagation()
      store.design.setOver({})
    }

    render() {
      const { data, parent } = this.props
      const { children, name, props, text, type } = data
      const comps = components[type]
      if (!comps) {
        return null
      }
      const Component = comps[name].component
      const style =
        store.design.over.identity === data.identity
          ? { ...props.style, ...overStyle }
          : props.style
      return (
        <Component
          {...toJS(props)}
          style={toJS(style)}
          onMouseOver={this.mouseOver}
          onMouseLeave={this.mouseLeave}
        >
          {text}
          {children.map((child) => (
            <Renderer data={child} key={child.identity} parent={data} />
          ))}
        </Component>
      )
    }
  }
)

export default Renderer
