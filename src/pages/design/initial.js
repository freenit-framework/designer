import { compile } from 'components'


export default {
  editing: {},
  over: {},
  rearranging: false,
  selected: {},
  tree: compile({
    children: [],
    component: 'div',
    props: {
      style: {
        minHeight: 'calc(100vh - 4px)',
      },
    },
  }),
}
