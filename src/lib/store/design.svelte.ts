import store from '.'
import type { Component } from '$lib/types'

export default class DesignStore {
  design = $state([])
  selected = $state(null)
  device = $state('desktop')
}
