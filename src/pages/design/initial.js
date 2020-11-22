import { compile, convert } from 'components'


const initial = {
  editing: {},
  over: {},
  rearranging: false,
  selected: {},
  theme: convert('theme', { palette: {} }),
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


export default initial
