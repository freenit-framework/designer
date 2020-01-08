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
    const { active, identity, isOver, store } = props
    if (isOver) {
      if (!this.set && identity !== store.design.over.identity) {
        this.set = true
        this.unset = false
        store.design.setOver({ identity, active })
      }
    } else {
      if (!this.unset && identity === store.design.over.identity) {
        this.set = false
        this.unset = true
        store.design.setOver({})
      }
    }
  }

  render() {
    return null
  }
}


export default withStore(DnDOver)
