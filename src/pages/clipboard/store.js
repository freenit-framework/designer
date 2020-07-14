export default class ClipboardStore {
  constructor(clipboard) {
    this.clipboard = clipboard[0]
    this.setSelected = clipboard[1]
  }

  control = (ctrl) => {
    this.setSelected({ ...this.clipboard, ctrl })
  }
}
