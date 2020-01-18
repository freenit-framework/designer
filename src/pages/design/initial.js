import { compile } from 'components'


export default {
  editing: {},
  over: {},
  selected: {},
  tree: compile({
    children: [],
    component: 'div',
    props: {
      style: {
        minHeight: 'calc(100vh - 2px)',
      },
    },
  }),
}
