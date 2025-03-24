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

export default style
