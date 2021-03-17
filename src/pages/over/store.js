import { makeAutoObservable } from 'mobx'


export default class OverStore {
  over = {}

  constructor() {
    makeAutoObservable(this)
  }
}
