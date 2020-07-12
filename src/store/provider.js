import React, { useState } from 'react'

// Pages
import {
  EmptyTemplate,
  Resolution,
  Store,
} from 'freenit'
import {
  Editing,
  Over,
  Rearrange,
  Selected,
  Theme,
  Tree,
} from 'pages'
import { withRouter } from 'react-router-dom'


export const data = {}


const StoreProvider = (props) => {
  const store = {
    editing: new Editing.store(useState(Editing.initial.editing)),
    history: props.history,
    notification: new EmptyTemplate.store(
      useState(EmptyTemplate.initial.detail),
    ),
    over: new Over.store(useState(Over.initial.over)),
    rearrange: new Rearrange.store(useState(Rearrange.initial.rearrange)),
    resolution: new Resolution.store(useState(Resolution.initial.detail)),
    selected: new Selected.store(useState(Selected.initial.selected)),
    theme: new Theme.store(useState(Theme.initial.theme)),
    tree: new Tree.store(useState(Tree.initial.tree)),
  }
  data.store = store
  return (
    <Store.Provider value={store}>
      {props.children}
    </Store.Provider>
  )
}


export default withRouter(StoreProvider)
