import { compile } from 'components'


const initial = {
  tree: compile({
    children: [],
    component: 'div',
    name: 'div',
    props: {
      style: { minHeight: '100%' },
    },
  }),
}


export default initial
