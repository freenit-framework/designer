import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { deepObserve } from 'mobx-utils'

import { decompile } from 'utils'
import components from 'components'
import store from 'store'
import DnD from './dnd'
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
      const myProps = {
        ...props,
        onMouseOver: this.mouseOver,
        onMouseLeave: this.mouseLeave,
        onClick: this.select,
      }
      delete myProps.style
      return (
        <DnD
          props={myProps}
          data={this.props.data}
          style={style}
          mouseOver={this.mouseOver}
          mouseLeave={this.mouseLeave}
          select={this.select}
        />
      )
    }
  }
)

export default Renderer
