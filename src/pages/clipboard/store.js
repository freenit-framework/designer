import { action, makeAutoObservable } from 'mobx'

export default class ClipboardStore {
  clipboard = { ctrl: false }

  constructor() {
    makeAutoObservable(this)
  }

  control = action((ctrl) => {
    this.clipboard.ctrl = ctrl
  })
}
