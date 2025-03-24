import { BaseStore } from '@freenit-framework/core'
import DesignStore from './design.svelte'
import SelectedStore from './selected.svelte'
import ThemeStore from './theme.svelte'
import UndoStore from './undo.svelte'

class Store extends BaseStore {
  design: DesignStore
  selected: SelectedStore
  theme: ThemeStore
  undo: UndoStore

  constructor(prefix = '/api/v1') {
    super(prefix)
    this.design = new DesignStore()
    this.selected = new SelectedStore()
    this.theme = new ThemeStore()
    this.undo = new UndoStore()
  }
}

const store = new Store()
export default store
