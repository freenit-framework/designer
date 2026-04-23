// @ts-nocheck
import store from '$lib/store'
import { attachComponents, findParent } from '$lib/utils'
import type { Component } from '$lib/types'

type DragPayload = {
  component: Component
  parentid: string | null
}

const serializeComponent = (component: Component): Component => ({
  id: component.id,
  name: component.name,
  title: component.title || '',
  children: component.children.map((child) => serializeComponent(child)),
  props: { ...component.props },
  css: { ...component.css },
  text: component.text || '',
  open: component.open,
})

export const allowDrop = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

export const drop =
  (parent: Component, index: number | null = null) =>
  (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const json = event.dataTransfer
      ? event.dataTransfer.getData('component') || event.dataTransfer.getData('text/plain')
      : ''

    if (!json) {
      return
    }

    let data: DragPayload
    try {
      data = JSON.parse(json)
    } catch {
      return
    }

    const { component, parentid } = data
    if (!component) {
      return
    }
    if (parent.id === component.id) {
      return
    }

    if (parentid) {
      const myparent = findParent(parentid)
      if (!myparent) {
        return
      }
      store.undo.action(myparent, 'children', [...myparent.children])
      myparent.children = myparent.children.filter((child) => child.id !== component.id)
    }

    attachComponents(component)
    if (parentid) {
      store.undo.append(parent, 'children', [...parent.children])
    } else {
      store.undo.action(parent, 'children', [...parent.children])
    }

    if (index !== null) {
      parent.children.splice(index, 0, component)
    } else {
      parent.children.push(component)
    }
    store.design.over = null
  }

export const dragStart =
  (component: Component, parentid: string | null = null) =>
  (event: DragEvent) => {
    const payload = {
      component: serializeComponent(component),
      parentid,
    }

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      const serialized = JSON.stringify(payload)
      event.dataTransfer.setData('component', serialized)
      event.dataTransfer.setData('text/plain', serialized)
    }
  }

export const dragEnd = () => {
  store.design.over = null
}
