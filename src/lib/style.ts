import type { Component } from '$lib/types'

const style = (css: Record<any, any>) => {
  let result = ''
  Object.keys(css).forEach((prop) => {
    if (css[prop].rgba) {
      result += `${prop}: ${css[prop].toHex()};`
    } else {
      result += `${prop}: ${css[prop]};`
    }
  })
  return result
}

const renderCssBlock = (id: string, css: Record<any, any>): string => {
  const keys = Object.keys(css)
  if (keys.length === 0) {
    return ''
  }

  let result = `.${id} {\n`
  for (const key of keys) {
    const value = css[key]
    if (value && typeof value === 'object' && value.toHex) {
      result += `  ${key}: ${value.toHex()};\n`
    } else {
      result += `  ${key}: ${value};\n`
    }
  }
  result += '}\n'
  return result
}

const calculateCssNode = (component: Component): string => {
  let result = renderCssBlock(component.id, component.css)

  if (component.media) {
    for (const [query, css] of Object.entries(component.media)) {
      const block = renderCssBlock(component.id, css)
      if (block) {
        result += `${query} {\n  ${block.replace(/\n/g, '\n  ').trimEnd()}\n}\n`
      }
    }
  }

  return result
}

export const calculateCss = (components: Component[]): string => {
  let result = ''
  const traverse = (component: Component) => {
    result += calculateCssNode(component)
    for (const child of component.children) {
      traverse(child)
    }
  }
  for (const component of components) {
    traverse(component)
  }
  return result
}

export default style
