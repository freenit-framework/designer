import React, { useState } from 'react'

// Pages
import {
  EmptyTemplate,
  Resolution,
  Store,
} from 'freenit'
import Design from 'pages/design'
import { withRouter } from 'react-router-dom'


export const data = {}


const StoreProvider = (props) => {
  const store = {
    design: new Design.store(
      useState(Design.initial.tree),
      useState(Design.initial.selected),
      useState(Design.initial.editing),
      useState(Design.initial.over),
      useState(Design.initial.rearranging),
      useState(Design.initial.theme),
    ),
    history: props.history,
    notification: new EmptyTemplate.store(
      useState(EmptyTemplate.initial.detail),
    ),
    resolution: new Resolution.store(useState(Resolution.initial.detail)),
  }
  data.store = store
  return (
    <Store.Provider value={store}>
      {props.children}
    </Store.Provider>
  )
}


export default withRouter(StoreProvider)
