import components from 'components'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { deepObserve } from 'mobx-utils'
import React from 'react'

import { decompile } from 'utils'
import store from 'store'
import styles from './styles'

const Renderer = observer(
  class Ren extends React.Component {
    constructor(props) {
      super(props)
      const { data } = props
      this.state = { props: decompile(toJS(data.props)) }
      this.disposer = deepObserve(data.props, () => {
        this.setState({ props: decompile(toJS(data.props)) })
      })
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

    componentWillUnmount() {
      this.disposer()
    }

    render() {
      const { data, parent } = this.props
      const { children, name, text, type } = data
      const { props } = this.state
      const { selected, over } = store.design
      const comps = components[type]
      if (!comps) {
        return null
      }
      const Component = comps[name].component
      const myStyle = props.style ? props.style : {}
      let style
      if (selected.identity === data.identity) {
        style = { ...myStyle, ...styles.selected }
      } else if (over.identity === data.identity) {
        style = { ...myStyle, ...styles.over }
      } else {
        style = myStyle
      }
      return (
        <Component
          {...props}
          style={style}
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
