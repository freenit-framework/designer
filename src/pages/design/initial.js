import { compile } from 'components'


export default {
  editing: {},
  selected: {},
  tree: compile({
    children: [],
    component: 'div',
    props: {
      style: {
        minHeight: 'calc(100vh - 2px)',
      },
      something: [
        'one',
        'two',
      ],
    },
  }),
}
