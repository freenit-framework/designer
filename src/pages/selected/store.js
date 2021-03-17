import { makeAutoObservable } from 'mobx'


export default class SelectedStore {
  selected = {}

  constructor() {
    makeAutoObservable(this)
  }

  select = (component) => {
    this.selected = component
  }
}
