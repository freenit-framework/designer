import store from '.'
import type { Component } from '$lib/types'

export default class DesignStore {
  design: Component[] = $state([])
  selected: Component | null = $state(null)
  device: string = $state('desktop')
}
