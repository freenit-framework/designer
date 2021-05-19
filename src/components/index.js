import html from './html'
import mui from './mui'
import icons from './icons'
export { default as Device } from './device'
export { default as Display } from './display'
export { default as FileControls } from './file-controls'
export { default as LeftPane } from './left-pane'
export { default as Props } from './props'
export { default as Renderer } from './renderer'
export { default as RightPane } from './right-pane'
export { default as Tree } from './tree'

const components = { html, mui, icons }

export const toProps = (data) => {
  if (data.type === 'file') {
    return `${data.pre}${data.file}${data.post}`
  }
  if (data.children) {
    // object
    const props = {}
    data.children.forEach((prop) => {
      props[prop.name] = toProps(prop)
    })
    return props
  }
  if (data.value) {
    // simple value or array
    if (Array.isArray(data.value)) {
      // array
      return data.value.map((item) => item.value)
    }
    return data.value // simple value
  }
}

export default components
