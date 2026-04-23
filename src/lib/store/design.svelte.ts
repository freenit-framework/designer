// @ts-nocheck
import Div from '$lib/components/Div.svelte'
import type { Component } from '$lib/types'

export default class DesignStore {
  children: Component[] = $state([])
  selected: Component | null = $state(null)
  device: string = $state('desktop')
  filter: string = $state('')
  over: Component | null = $state(null)
  document = $state({
    includeChota: true,
    htmlProps: { lang: 'en' },
    bodyProps: {},
    head: [],
    bodyAppend: [],
    rawBody: '',
  })
  id: string = 'root'
  name: string = 'root'
  title: string = 'root'
  props: Record<string, any> = {}
  css: Record<string, any> = {}
  text: string = ''
  component: any = Div
}
