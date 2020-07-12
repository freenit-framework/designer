import { compile } from 'components'


export default {
  tree: compile({
    children: [],
    component: 'div',
    name: 'div',
    props: {
      style: {
        minHeight: 'calc(100vh - 4px)',
        backgroundColor: '#bbb',
      },
    },
  }),
}
