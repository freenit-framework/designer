import { store } from 'freenit'
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


store.auth.init('/api/v0')
const mystore = {
  ...store,
  clipboard: Clipboard.store,
  display: Display.store,
  editing: Editing.store,
  over: Over.store,
  rearrange: Rearrange.store,
  selected: Selected.store,
  theme: Theme.store,
  tree: Tree.store,
}


export default mystore
