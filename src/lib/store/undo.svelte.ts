import store from '.'
import { compile } from '../utils/props'
import type { UndoItem } from '$lib/types'

const undoArray: UndoItem[] = []
const redoArray: UndoItem[] = []

export default class UndoStore {
  undolist = $state(undoArray)
  redolist = $state(redoArray)

  undo = () => {
    if (undolist.length > 0) {
      const undoItem = undolist.pop()
      const { parent, attribute, value } = undoItem
      const current = parent[attribute as keyof Component]
      if (value === undefined) {
        delete parent[attribute as keyof Component]
      } else {
        parent[attribute as keyof Component] = value
      }
      redolist.push({ ...undoItem, value: current })
    }
  }

  redo = () => {
    if (redolist.length > 0) {
      const redoItem = redolist.pop()
      const { parent, attribute, value } = redoItem
      const current = parent[attribute as keyof Component]
      if (value === undefined) {
        delete parent[attribute as keyof Component]
      } else {
        parent[attribute as keyof Component] = value
      }
      undolist.push({ ...redoItem, value: current })
    }
  }
}
