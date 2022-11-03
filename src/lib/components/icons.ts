import * as icons from '@mdi/js'
import { makeid } from '$lib/utils'
import { compile } from '$lib/utils/props'
import { Svg, Path } from './components'

const iconcomponents = Object.keys(icons).map((name) => ({
  id: makeid(),
  name: 'svg',
  component: Svg,
  title: name,
  data: icons[name],
  text: '',
  props: compile({}),
  style: compile({
    width: '30px',
    height: '30px',
  }),
  children: [],
}))

export default iconcomponents
