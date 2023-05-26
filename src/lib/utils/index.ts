import { get } from 'svelte/store'
import type { Component } from '$lib/types'
import { theme, selected } from '$lib/store'
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

export function changePaste(component: Component): Component {
  const newone = {
    ...component,
    id: makeid(),
    props: JSON.parse(JSON.stringify(component.props)),
    style: JSON.parse(JSON.stringify(component.style)),
    children: component.children.map((item: Component) => changePaste(item)),
    component: components[component.name],
  }
  return newone
}

export function toJson(component: Component): Record<any, any> {
  const { id, name, props, style, children, text, data, title } = component
  const result: any = {
    id,
    name,
    text,
    props,
    style,
    children: children.map((c: Component) => toJson(c)),
  }
  if (name === 'svg') {
    result.data = data
    result.title = title
  }
  return result
}

export function object2component(obj: Record<string, any>): Component {
  const { id, name, style, props, text, children, data, title } = obj
  const component: Component = {
    id,
    name,
    style,
    props,
    text,
    component: '',
    children: children.map((c: Component) => object2component(c)),
  }
  if (component.name === 'svg') {
    component.data = data
    component.title = title
    component.component = components.Svg
  } else {
    component.component = components[obj.name] || ''
  }
  return component
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
