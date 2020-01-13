import {
  AppBar,
  Paper,
} from '@material-ui/core'

export { default as Component } from './component'
export { default as DnD } from './dnd'
export { default as DnDOver } from './dnd-over'
export { default as Display } from './display'
export { default as Editor } from './editor'
export { default as Menu } from './menu'
export { default as Props } from './props'

const components = [
  {
    children: [],
    component: AppBar,
    name: 'AppBar',
    props: {
      position: 'static',
      style: {},
    },
    text: 'Title',
  },

  {
    children: [],
    component: Paper,
    name: 'Paper',
    props: {
      style: {
        minHeight: 30,
      },
    },
  },
]


const isSimple = data =>  typeof data === 'number' ||
                          typeof data === 'boolean' ||
                          typeof data === 'string'


const convert = (key, value) => {
  const base = {
    name: key,
    identity: Math.random()
  }
  if (isSimple(value)) {
    return {
      ...base,
      value,
    }
  }
  if (Array.isArray(value)) {
    return {
      ...base,
      value: value.map(v => convert(null, v)),
    }
  }
  if (typeof value === 'object') {
    return {
      ...base,
      children: Object.getOwnPropertyNames(value).map(
        name => convert(name, value[name]),
      ),
    }
  }
}


export const toProps = (data) => {
  if (data.children) { // object
    const props = {}
    data.children.forEach(prop => {
      props[prop.name] = toProps(prop)
    })
    return props
  }
  if (data.value) { // simple value or array
    if (Array.isArray(data.value)) { // array
      return data.value.map(item => item.value)
    }
    return data.value // simple value
  }
}


export const compile = (component) => {
  const result = {
    ...component,
    identity: Math.random(),
  }
  result.props = convert('props', result.props)
  result.children = result.children.map(component => compile(component))
  return result
}


export default components.map(component => compile(component))
