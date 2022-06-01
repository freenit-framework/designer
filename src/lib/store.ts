import { writable } from 'svelte/store'
import { compile } from './utils/props'
import type { Component, UndoItem } from '$lib/types'

export const initialComponent: Component = {
  id: '',
  name: 'root',
  component: '',
  text: '',
  children: [],
  props: compile({}),
  style: compile({}),
}

export const design = writable({ ...initialComponent, id: 'root' })
export const selected = writable({ ...initialComponent })
export const parent = writable({ ...initialComponent })
export const dnd = writable({ ...initialComponent })
export const over = writable({ ...initialComponent })
export const theme = writable(
  compile({
    'bg-color': '#ffffff',
    'bg-secondary-color': '#f3f3f6',
    'color-primary': '#14854F',
    'color-lightGrey': '#d2d6dd',
    'color-grey': '#747681',
    'color-darkGrey': '#3f4144',
    'color-error': '#d43939',
    'color-success': '#28bd14',
    'grid-maxWidth': '120rem',
    'grid-gutter': '2rem',
    'font-size': '1.6rem',
    'font-color': '#333333',
    'font-family-sans': '',
    'font-family-mono': 'monaco, Consolas, Lucida Console, monospace',
  }),
)
theme.update((t) => {
  for (const item in t.value) {
    const value = t.value[item]
    if (value.value.startsWith('#')) {
      value.type = 'color'
    }
  }
  return t
})

const undoArray: UndoItem[] = []
const redoArray: UndoItem[] = []
export const undo = writable(undoArray)
export const redo = writable(redoArray)
export const framework = writable('svelte')
export const device = writable('desktop')
