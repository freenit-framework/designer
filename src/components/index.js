import {
  AppBar,
  Paper,
} from '@material-ui/core'

export { default as Component } from './component'
export { default as DnD } from './dnd'

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
        width: 200,
        height: 30,
      },
    },
  },
}
