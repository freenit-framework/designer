import Body from '$lib/components/Div.svelte'
import type { Component } from '$lib/types'

export default class DesignStore {
  children: Component[] = $state([])
  selected: Component | null = $state(null)
  device: string = $state('desktop')
  filter: string = $state('')
  over: Component | null = $state(null)
  id: 'root'
  name: 'root'
  title: 'root'
  props: {}
  css: {}
  text: ''
  component: Div
}
