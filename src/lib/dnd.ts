import store from '$lib/store'
import * as components from '$lib/components'
import { attachComponents, findParent } from '$lib/utils'
import type { Component } from '$lib/types'

export const allowDrop = (event: Event) => {
  event.preventDefault()
}

export const drop =
  (parent: Component | null, index: number | null = null) =>
  (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const json = event.dataTransfer ? event.dataTransfer.getData('component') : ''
    const data: Component = JSON.parse(json)
    const { component, parentid } = data
    if (parentid) {
      if (parent && parent.id === component.id) {
        return
      }
      if (parentid === 'root') {
        store.undo.action(store.design, 'design', [...store.design.children])
        store.design.children = store.design.children.filter((child) => child.id !== component.id)
      } else {
        const myparent = findParent(parentid)
        store.undo.action(myparent, 'children', [...myparent.children])
        if (myparent) {
          myparent.children = myparent.children.filter((child) => child.id !== component.id)
        }
      }
    }
    attachComponents(component)
    if (parent) {
      if (parentid) {
        store.undo.append(parent, 'children', [...parent.children])
      } else {
        store.undo.action(parent, 'children', [...parent.children])
      }
      if (index) {
        parent.children.splice(index, 0, component)
      } else {
        parent.children.push(component)
      }
    } else {
      if (parentid) {
        store.undo.append(store.design, 'design', [...store.design.children])
      } else {
        store.undo.action(store.design, 'design', [...store.design.children])
      }
      if (index) {
        store.design.children.splice(index, 0, component)
      } else {
        store.design.children.push(component)
      }
    }
    store.design.over = null
  }

export const dragStart =
  (component: Component, parentid: str | null = null) =>
  (event: DragEvent) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('component', JSON.stringify({ component, parentid }))
    }
  }

export const dragEnd = () => {
  store.design.over = null
}
