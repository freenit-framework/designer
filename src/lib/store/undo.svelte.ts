import type { UndoItem } from '$lib/types'

const undoArray: UndoItem[] = []
const redoArray: UndoItem[] = []

export default class UndoStore {
  undolist = $state(undoArray)
  redolist = $state(redoArray)

  undo = () => {
    if (this.undolist.length > 0) {
      const undoItem = this.undolist.pop()
      const { parent, attribute, value } = undoItem
      if (parent) {
        const current = parent[attribute]
        if (value === undefined) {
          delete parent[attribute]
        } else {
          parent[attribute] = value
        }
        this.redolist.push({ ...undoItem, value: current })
      } else {
        const myredo: UndoItem[] = []
        for (var i = undoItem.length - 1; i >= 0; i--) {
          const { parent, attribute, value } = undoItem[i]
          const current = parent[attribute]
          myredo.push({ ...undoItem[i], value: current })
          if (value === undefined) {
            delete parent[attribute]
          } else {
            parent[attribute] = value
          }
        }
        this.redolist.push(myredo)
      }
    }
  }

  redo = () => {
    if (this.redolist.length > 0) {
      const redoItem = this.redolist.pop()
      const { parent, attribute, value } = redoItem
      if (parent) {
        const current = parent[attribute]
        if (value === undefined) {
          delete parent[attribute]
        } else {
          parent[attribute] = value
        }
        this.undolist.push({ ...redoItem, value: current })
      } else {
        const myundo: UndoItem[] = []
        for (var i = redoItem.length - 1; i >= 0; i--) {
          const { parent, attribute, value } = redoItem[i]
          const current = parent[attribute]
          myundo.push({ ...redoItem[i], value: current })
          if (value === undefined) {
            delete parent[attribute]
          } else {
            parent[attribute] = value
          }
        }
        this.redolist.push(myundo)
      }
    }
  }

  action = (parent, attribute, value) => {
    this.undolist.push({ parent, attribute, value })
    this.redolist = []
  }

  append = (parent, attribute, value) => {
    if (this.undolist.length < 1) {
      return
    }
    const item = this.undolist.pop()
    if (item.parent) {
      item.push({ parent, attribute, value })
      this.undolist.push(item)
    } else {
      this.undolist.push(...item, { parent, attribute, value })
    }
  }
}
