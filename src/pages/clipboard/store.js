import { makeAutoObservable } from 'mobx'


export default class ClipboardStore {
  clipboard = { ctrl: false }

  constructor() {
    makeAutoObservable(this)
  }

  control = (ctrl) => { this.clipboard.ctrl = ctrl }
}
