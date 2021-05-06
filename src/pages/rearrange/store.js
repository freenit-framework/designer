import { action, makeAutoObservable } from 'mobx'

export default class RearrangeStore {
  rearrange = false

  constructor() {
    makeAutoObservable(this)
  }

  setRearrange = action((r) => {
    this.rearrange = r
  })
}
