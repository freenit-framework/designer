import { makeAutoObservable } from 'mobx'


export default class DisplayStore {
  display = 'desktop'

  constructor() {
    makeAutoObservable(this)
  }
}
