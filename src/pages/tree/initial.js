import { compile } from 'components'


const initial = {
  tree: compile({
    children: [],
    component: 'div',
    name: 'div',
    props: {
      style: { minHeight: 'calc(100vh - 4px)' },
    },
  }),
}


export default initial
