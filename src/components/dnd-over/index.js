import React from 'react'
import { withStore } from 'freenit'


class DnDOver extends React.Component {
  constructor(props) {
    super(props)
    this.setActive(props)
  }

  componentDidUpdate() {
    this.setActive(this.props)
  }

  setActive = (props) => {
    const { identity, isOver, store } = props
    if (isOver && identity !== store.design.selected.identity) {
      store.design.setOverComponent(identity)
    }
  }

  render() {
    return null
  }
}


export default withStore(DnDOver)
