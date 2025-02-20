import store from '.'
import { compile } from '../utils/props'
import type { Component } from '$lib/types'

const initialComponent: Component = {
  id: '',
  name: 'root',
  component: '',
  text: '',
  children: [],
  props: compile({}),
  style: compile({}),
}

export default class DesignStore {
  enableShortcuts = $state(true)
  design = $state({ ...initialComponent, id: 'root' })
  selected = $state({ ...initialComponent })
  parent = $state({ ...initialComponent })
  dnd = $state({ ...initialComponent })
  over = $state({ ...initialComponent })
  device = $state('desktop')
}
