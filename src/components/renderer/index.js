import components from 'components'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'

import store from 'store'
import styles from './styles'

const overStyle = { borderStyle: 'dotted', borderWidth: 1 }
const selectedStyle = {
  borderStyle: 'dotted',
  borderWidth: 2,
  borderColor: 'red',
}

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

    select = (event) => {
      event.stopPropagation()
      store.design.setSelected(this.props.data)
    }

    render() {
      const { data, parent } = this.props
      const { children, name, props, text, type } = data
      const comps = components[type]
      if (!comps) {
        return null
      }
      const Component = comps[name].component
      let style = props.style
      if (store.design.selected.identity === data.identity) {
        style = { ...props.style, ...selectedStyle }
      } else if (store.design.over.identity === data.identity) {
        style = { ...props.style, ...overStyle }
      }
      return (
        <Component
          {...toJS(props)}
          style={toJS(style)}
          onMouseOver={this.mouseOver}
          onMouseLeave={this.mouseLeave}
          onClick={this.select}
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
