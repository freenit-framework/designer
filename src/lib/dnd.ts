import store from '$lib/store'
import * as components from '$lib/components/components'
import type { Component } from '$lib/types'

export const allowDrop = (event: Event) => {
  event.preventDefault()
}

export const drop = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  const json = event.dataTransfer ? event.dataTransfer.getData('component') : ''
  const data: Component = JSON.parse(json)
  data.component = components[data.name]
  store.design.design.push(data)
}
