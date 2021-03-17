import { makeAutoObservable } from 'mobx'


export default class EditingStore {
  editing = {}

  constructor() {
    makeAutoObservable(this)
  }
}
