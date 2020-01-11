import React from 'react'
import { withStore } from 'freenit'


class DnDOver extends React.Component {
  state = {
  }

  constructor(props) {
    super(props)
    this.set = false
    this.unset = true
    this.setActive(props)
  }

  componentDidUpdate() {
    this.setActive(this.props)
  }

  setActive = (props) => {
    const { identity, isOver, store } = props
    if (isOver) {
      if (!this.set && identity !== store.design.selected.identity) {
        this.set = true
        this.unset = false
        store.design.setOverComponent(identity)
      }
    } else {
      if (!this.unset && identity === store.design.selected.identity) {
        this.set = false
        this.unset = true
        store.design.setSelected({})
      }
    }
  }

  render() {
    return null
  }
}


export default withStore(DnDOver)
