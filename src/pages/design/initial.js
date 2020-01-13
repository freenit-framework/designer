import { compile } from 'components'


export default {
  over: {},
  selected: {},
  tree: compile({
    component: 'div',
    children: [],
    props: {
      style: {
        minHeight: '100vh',
      },
      something: [
        'one',
        'two',
      ],
    },
  }),
}
