import { get } from 'svelte/store'
import type { Component, UndoItem } from '$lib/types'
import {
  design,
  dnd,
  over,
  initialComponent,
  theme,
  undo,
  selected,
} from '$lib/store'
import * as components from '$lib/components/components'

export function makeid(length = 8): string {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  for (let i = 0; i < length; ++i) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export function prepareStyle(
  style: Record<string, boolean | string | number | null>,
) {
  if (!style) {
    return ''
  }
  const css = Object.keys(style)
    .map((prop) => `${prop}: ${style[prop]};`)
    .join(' ')
  return css
}

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
    dnd.set(component)
    design.set(get(design))
  }
  return handler
}

export function dragEnd() {
  const component = get(dnd)
  const { parent } = component
  const index = Number(component.index)
  if (parent && index >= 0) {
    delete component['parent']
    delete component['index']
    parent.children.splice(index, 0, component)
  }
  dnd.set({ ...initialComponent })
  over.set({ ...initialComponent })
  design.set(get(design))
}

export function changeIds(component: Component): Component {
  const newone = {
    ...component,
    id: makeid(),
    props: JSON.parse(JSON.stringify(component.props)),
    style: JSON.parse(JSON.stringify(component.style)),
    children: component.children.map((item) => changeIds(item)),
  }
  return newone
}

export function drop(component: Component, index: number = -1) {
  function doDrop(event: Event) {
    event.stopPropagation()
    event.preventDefault()
    const existing = get(dnd)
    const undoStore = get(undo)
    const newone = changeIds(existing)
    const undoItem: UndoItem = {
      parent: component,
      attribute: 'children',
      value: component.children,
    }
    undoStore.push(undoItem)
    if (index === -1) {
      component.children = [...component.children, newone]
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

export function toJson(component: Component): Record<any, any> {
  const { id, name, props, style, children, text } = component
  return {
    id,
    name,
    text,
    props,
    style,
    children: children.map((c) => toJson(c)),
  }
}

export function object2component(obj: Record<string, any>): Component {
  const { id, name, style, props, text, children } = obj
  return {
    id,
    name,
    style,
    props,
    text,
    component: components[obj.name] || '',
    children: children.map((c: Component) => object2component(c)),
  }
}

export function toObject(json: string): Component {
  const obj = JSON.parse(json)
  return object2component(obj)
}

export function setThemeProp(key: string, value: string) {
  document.documentElement.style.setProperty(`--${key}`, value)
  theme.update((t) => ({ ...t, [key]: value }))
}

export function findSelected(component: Component): boolean {
  const selectedData = get(selected)
  if (component.id === selectedData.id) {
    component.open = true
    return true
  }
  const actives = component.children.map((child) => findSelected(child))
  if (actives.includes(true)) {
    component.open = true
    return true
  }
  return false
}
