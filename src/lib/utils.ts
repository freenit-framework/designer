// @ts-nocheck
import * as components from '$lib/components'
import { colord } from 'colord'
import store from '$lib/store'
import type { Component } from '$lib/types.d'

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const IDENTIFIER_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/

const getIconName = (component: Component): string | null => {
  if (typeof component.title !== 'string') {
    return null
  }

  const trimmed = component.title.trim()
  if (!trimmed || !IDENTIFIER_RE.test(trimmed)) {
    return null
  }

  return trimmed
}

export function makeid(length = 8): string {
  let result = ''
  for (let i = 0; i < length; ++i) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export const attachComponents = (component: Component) => {
  component.id = makeid()
  component.component = components[component.name]
  component.children.forEach((child) => {
    attachComponents(child)
  })
}

export const setColors = (component: Component) => {
  Object.keys(component.props).forEach((prop) => {
    const value = component.props[prop]
    if (value && value.rgba) {
      const { rgba } = value
      component.props[prop] = colord(`rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`)
    }
  })
  Object.keys(component.css).forEach((prop) => {
    const value = component.css[prop]
    if (value && value.rgba) {
      const { rgba } = value
      component.css[prop] = colord(`rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`)
    }
  })
  component.children.forEach((child) => setColors(child))
}

export const setThemeColors = (theme: Record<string, any>) => {
  Object.keys(theme).forEach((prop) => {
    const value = theme[prop]
    if (value && value.rgba) {
      const { rgba } = value
      theme[prop] = colord(`rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`)
    }
  })
}

const _findParent = (parentid: str, component: Component): Component | null => {
  let ret = null
  if (component.id === parentid) {
    return component
  }
  for (child of component.children) {
    ret = _findParent(parentid, child)
    if (ret) {
      return ret
    }
  }
  return null
}

export const findParent = (parentid: str): Component | null => {
  if (parentid === 'root') {
    return store.design
  }
  let ret = null
  for (child of store.design.children) {
    ret = _findParent(parentid, child)
    if (ret) {
      return ret
    }
  }
  return null
}

const _findOwner = (targetid: string, parent: Component): Component | null => {
  for (const child of parent.children) {
    if (child.id === targetid) {
      return parent
    }
    const nested = _findOwner(targetid, child)
    if (nested) {
      return nested
    }
  }
  return null
}

export const removeSelected = () => {
  const selected = store.design.selected
  if (!selected) {
    return
  }

  const parent = _findOwner(selected.id, store.design)
  if (!parent) {
    return
  }

  store.undo.action(parent, 'children', [...parent.children])
  parent.children = parent.children.filter((child) => child.id !== selected.id)
  store.design.selected = null
}

const _calculateData = (component: Component) => {
  let ret = ''
  if (component.text) {
    ret += `    '${component.id}': '${component.text}',\n`
  }
  for (var child of component.children) {
    ret += _calculateData(child)
  }
  return ret
}

export const calculateData = () => {
  let ret = ''
  for (var component of store.design.children) {
    ret += _calculateData(component)
  }
  return ret
}

const _calculateCss = (component: Component) => {
  let ret = ''
  const keys = Object.keys(component.css)
  if (keys.length > 0) {
    ret += `\n  .${component.id} {\n`
    for (var key of keys) {
      const value = component.css[key]
      const render = value.toHex ? value.toHex() : value
      ret += `    ${key}: ${render};\n`
    }
    ret += '  }\n'
  }
  for (var child of component.children) {
    ret += _calculateCss(child)
  }
  return ret
}

export const calculateCss = () => {
  let ret = ''
  for (var component of store.design.children) {
    ret += _calculateCss(component)
  }
  return ret
}

const _calculateComponent = (component: Component, level: number = 0) => {
  const propClass = typeof component?.props?.class === 'string' ? component.props.class.trim() : ''
  const classes: string[] = []
  if (Object.keys(component.css).length > 0) {
    classes.push(component.id)
  }
  if (propClass) {
    classes.push(propClass)
  }

  let ret = ' '.repeat(level)
  ret += '<'
  ret += `${component.name.toLowerCase()}`
  if (classes.length > 0) {
    ret += ` class="${classes.join(' ')}"`
  }
  for (var prop in component.props) {
    if (prop === 'class') {
      continue
    }
    if (component.name === 'Path' && prop === 'd') {
      const iconName = getIconName(component)
      if (iconName) {
        ret += ` ${prop}={${iconName}}`
      } else {
        ret += ` ${prop}="${component.props[prop]}"`
      }
    } else {
      ret += ` ${prop}="${component.props[prop]}"`
    }
  }
  ret += '>'
  ret += '\n'
  for (var child of component.children) {
    ret += _calculateComponent(child, level + 2)
  }
  if (component.text) {
    ret += ' '.repeat(level + 2)
    ret += `{data[${component.id}]}\n`
  }
  ret += ' '.repeat(level)
  ret += '</'
  ret += `${component.name.toLowerCase()}`
  ret += '>\n'
  return ret
}

export const calculateComponents = () => {
  let ret = ''
  for (var component of store.design.children) {
    ret += _calculateComponent(component)
  }
  return ret
}

export const calculateTheme = () => {
  let ret = '  :root {\n'
  for (var prop in store.theme.detail) {
    const value = store.theme.detail[prop]
    const render = value.toHex ? value.toHex() : value
    ret += `    --${prop}: ${render};\n`
  }
  ret += '  }\n'
  return ret
}

const _collectImports = (component: Component, icons: Set<string>) => {
  if (component.name === 'Svg') {
    const iconName = getIconName(component)
    if (iconName) {
      icons.add(iconName)
    }
  }
  for (var child of component.children) {
    _collectImports(child, icons)
  }
}

export const calculateImports = () => {
  const icons = new Set<string>()
  for (var component of store.design.children) {
    _collectImports(component, icons)
  }
  if (icons.size === 0) {
    return ''
  }

  const imports = Array.from(icons).sort().join(', ')
  return `  import { ${imports} } from '@mdi/js'\n`
}
