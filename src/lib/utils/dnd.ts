import { get } from 'svelte/store'
import type { Component, UndoItem } from '$lib/types'
import { design, dnd, over, initialComponent, undo } from '$lib/store'
import { changeIds } from '.'

export function dragStart(
  component: Component,
  parent: Component | null = null,
  index = -1,
) {
  function handler(event: Event) {
    event.stopPropagation()
    if (parent && index >= 0) {
      component.parent = parent
      component.index = index
      component.parent.children.splice(index, 1)
    }
  }
  dnd.set(component)
  design.set(get(design))
  return handler
}

export function dragEnd() {
  const component = get(dnd)
  const { parent } = component
  const index = Number(component.index)
  if (parent && index >= 0) {
    parent.children.splice(index, 0, component)
  }
  delete component['parent']
  delete component['index']
  dnd.set({ ...initialComponent })
  over.set({ ...initialComponent })
  design.set(get(design))
}

export function drop(component: Component, index: number = -1) {
  function doDrop(event: Event) {
    event.stopPropagation()
    event.preventDefault()
    const existing = get(dnd)
    delete existing['parent']
    delete existing['index']
    const undoStore = get(undo)
    const newone = changeIds(existing)
    const undoItem: UndoItem = {
      parent: component,
      attribute: 'children',
      value: [...component.children],
    }
    undoStore.push(undoItem)
    if (index === -1) {
      component.children.push(newone)
    } else {
      component.children.splice(index, 0, newone)
    }
    dnd.set({ ...initialComponent })
    over.set({ ...initialComponent })
    design.set(get(design))
  }
  return doDrop
}

export function dragEnter(component: Component) {
  function de(event: Event) {
    event.stopPropagation()
    over.set(component)
  }
  return de
}

export function dragLeave() {
  over.set({ ...initialComponent })
}
