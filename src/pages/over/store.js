import { action, makeAutoObservable } from 'mobx'

export default class OverStore {
  over = {}

  constructor() {
    makeAutoObservable(this)
  }

  setOver = action((o) => {
    this.over = o
  })
}
