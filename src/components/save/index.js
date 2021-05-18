import React from 'react'
import { toJS } from 'mobx'
import { deepObserve } from 'mobx-utils'
import { Button } from '@material-ui/core'
import { Base64 } from 'js-base64'

import store from 'store'

class Save extends React.Component {
  state = {
    tree: toJS(store.design.tree),
    theme: toJS(store.design.theme),
  }

  constructor(props) {
    super(props)
    deepObserve(store.design.tree, () => {
      this.setState({ tree: toJS(store.design.tree) })
    })
    deepObserve(store.design.theme, () => {
      this.setState({ theme: toJS(store.design.theme) })
    })
  }

  render() {
    const display = JSON.stringify(this.state, null, 2)
    const saveData = `data:application/json;base64,${Base64.encode(display)}`
    return (
      <a href={saveData} download="design.json">
        <Button variant="outlined" color="primary">
          Save
        </Button>
      </a>
    )
  }
}

export default Save
