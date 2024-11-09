import { makeid } from '$lib/utils'
import { compile } from '$lib/utils/props'
import * as components from './components'

const htmlcomponents = Object.keys(components).map((name) => ({
  name,
  id: makeid(),
  component: components[name],
  children: [],
  props: name === 'Option' ? compile({ value: 'dummy' }) : compile({}),
  style: compile({}),
  text: name === 'Option' ? 'dummy' : '',
}))

export default htmlcomponents
