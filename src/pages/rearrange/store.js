import { makeAutoObservable } from 'mobx'


export default class RearrangeStore {
  rearrange = false

  constructor() {
    makeAutoObservable(this)
  }
}
