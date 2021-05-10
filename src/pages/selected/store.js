import { makeAutoObservable, action } from 'mobx'

export default class SelectedStore {
  selected = {}

  constructor() {
    makeAutoObservable(this)
  }

  select = action((component) => {
    this.selected = component
  })
}
