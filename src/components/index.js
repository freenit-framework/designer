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

export default {
  AppBar: {
    component: AppBar,
    props: {
      position: 'static',
      style: {},
    },
    text: 'Title',
  },

  Paper: {
    component: Paper,
    props: {
      style: {
        minHeight: 30,
      },
    },
  },
}
