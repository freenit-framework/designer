import { action, makeAutoObservable } from 'mobx'

export default class DisplayStore {
  display = 'desktop'

  constructor() {
    makeAutoObservable(this)
  }

  setDisplay = action((d) => {
    this.display = d
  })
}
