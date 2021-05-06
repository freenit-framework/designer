import { store } from '@freenit-framework/core'
import {
  Clipboard,
  Display,
  Editing,
  Over,
  Rearrange,
  Selected,
  Theme,
  Tree,
} from 'pages'

store.clipboard = Clipboard.store
store.display = Display.store
store.editing = Editing.store
store.over = Over.store
store.rearrange = Rearrange.store
store.selected = Selected.store
store.theme = Theme.store
store.tree = Tree.store

export default store
