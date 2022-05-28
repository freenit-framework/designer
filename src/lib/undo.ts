import type { Component, UndoItem } from '$lib/types'
import { get } from 'svelte/store'
import {
  design,
  selected,
  theme,
  undo as undoStore,
  redo as redoStore,
} from '$lib/store'

export function undo() {
  const storeundo = get(undoStore)
  if (storeundo.length > 0) {
    const storeredo = get(redoStore)
    const undoItem: UndoItem = storeundo.pop() as UndoItem
    const { parent, attribute, value } = undoItem
    const current = parent[attribute as keyof Component]
    if (value === undefined) {
      delete parent[attribute as keyof Component]
    } else {
      parent[attribute as keyof Component] = value
    }
    const redoItem: UndoItem = { ...undoItem, value: current }
    storeredo.push(redoItem)
    undoStore.set(storeundo)
    redoStore.set(storeredo)
    design.set(get(design))
    selected.set(get(selected))
    theme.set(get(theme))
  }
}

export function redo() {
  const storeredo = get(redoStore)
  if (storeredo.length > 0) {
    const storeundo = get(undoStore)
    const redoItem: UndoItem = storeredo.pop() as UndoItem
    const { parent, attribute, value } = redoItem
    const current = parent[attribute as keyof Component]
    if (value === undefined) {
      delete parent[attribute as keyof Component]
    } else {
      parent[attribute as keyof Component] = value
    }
    const undoItem: UndoItem = { ...redoItem, value: current }
    storeundo.push(undoItem)
    undoStore.set(storeundo)
    redoStore.set(storeredo)
    design.set(get(design))
    selected.set(get(selected))
  }
}
