import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'

import components from 'components'
import styles from './styles'

const Renderer = observer(
  class Ren extends React.Component {
    render() {
      const { children, name, props, text, type } = this.props.data
      const comps = components[type]
      if (!comps) {
        return null
      }
      const Component = comps[name].component
      return (
        <Component {...toJS(props)}>
          {text}
          {children.map((child) => (
            <Renderer data={child} key={child.identity} />
          ))}
        </Component>
      )
    }
  }
)

export default Renderer
