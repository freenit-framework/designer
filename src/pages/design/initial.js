import { compile } from 'components'


export default {
  over: {},
  selected: {},
  tree: compile({
    component: 'div',
    children: [],
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
