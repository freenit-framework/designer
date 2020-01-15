import { compile } from 'components'


export default {
  over: {},
  selected: {},
  tree: compile({
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
    children: [
      {
        component: 'div',
        children: [],
        props: {
          style: {},
        },
      },
    ],
  }),
}
