import * as mui from '@material-ui/core'

export { default as Component } from './component'
export { default as Display } from './display'
export { default as DnD } from './dnd'
export { default as Editor } from './editor'
export { default as Export } from './export'
export { default as Menu } from './menu'
export { default as PropItem } from './prop-item'
export { default as Props } from './props'
export { default as Save } from './save'
export { default as TreeItem } from './tree-item'


export const compile = (component) => {
  const result = {
    ...component,
    identity: Math.random(),
  }
  result.props = convert('props', result.props)
  result.children = result.children.map(item => compile(item))
  return result
}


export const isSimple = data => typeof data === 'number' ||
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


export const decompile = (data) => {
  const result = {
    ...data,
  }
  delete result.identity
  result.props = toProps(result.props)
  result.children = result.children.map(item => decompile(item))
  return result
}


export const StringComponents = {}
Object.getOwnPropertyNames(mui).forEach(
  name => {
    if (mui[name].render) {
      StringComponents[name] = mui[name]
    }
  }
)


const components = [
  {
    component: mui.AppBar,
    name: 'AppBar',
    props: {
      position: 'static',
    },
    children: [{
      component: mui.Toolbar,
      name: 'Toolbar',
      props: {},
      children: [{
        component: mui.Typography,
        name: 'Typography',
        props: {
          variant: 'h6',
        },
        text: 'Title',
        children: [],
      }],
    }],
  },

  {
    component: mui.Paper,
    name: 'Paper',
    props: {
      style: {
        minHeight: 30,
      },
    },
    children: [],
  },

  {
    component: mui.Toolbar,
    name: 'Toolbar',
    props: {},
    children: [],
  },

  {
    component: mui.Typography,
    name: 'Typography',
    text: 'Typography',
    props: {},
    children: [],
  },
]


export default components.map(item => compile(item))
