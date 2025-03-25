import * as components from '$lib/components'
import { colord } from 'colord'
import store from '$lib/store'
import type { Component } from '$lib/types.d'

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

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
  let ret = ' '.repeat(level)
  ret += '<'
  ret += `${component.name.toLowerCase()}`
  if (Object.keys(component.css).length > 0) {
    ret += ` class="${component.id}"`
  }
  for (var prop in component.props) {
    if (component.name === 'Path' && prop === 'd') {
      ret += ` ${prop}={${component.title}}`
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

const _calculateImports = (component: Component) => {
  let ret = ''
  if (component.name === 'Svg') {
    ret += `\n    ${component.title},`
  }
  for (var child of component.children) {
    ret += _calculateImports(child)
  }
  return ret
}

export const calculateImports = () => {
  let ret = '  import {'
  for (var component of store.design.children) {
    ret += _calculateImports(component)
  }
  ret += "\n  } from '@mdi/js'\n"
  return ret
}
