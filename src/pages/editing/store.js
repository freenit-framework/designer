import { action, makeAutoObservable } from 'mobx'

export default class EditingStore {
  editing = {}

  constructor() {
    makeAutoObservable(this)
  }

  setEditing = action((e) => {
    this.editing = e
  })
}
