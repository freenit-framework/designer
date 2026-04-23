// @ts-nocheck
import { colord } from 'colord'
import { browser } from '$app/environment'

export default class ThemeStore {
  detail = $state({
    'bg-color': colord('#ffffff'),
    'bg-secondary-color': colord('#f5f7fb'),
    'color-primary': colord('#2f63f0'),
    'color-lightGrey': colord('#d9e0eb'),
    'color-grey': colord('#60708a'),
    'color-darkGrey': colord('#1b2433'),
    'color-error': colord('#d43939'),
    'color-success': colord('#28bd14'),
    'grid-maxWidth': '120rem',
    'grid-gutter': '2rem',
    'font-size': '1.6rem',
    'font-color': colord('#333333'),
    'font-family-sans': 'sans-serif',
    'font-family-mono': 'monaco, Consolas, Lucida Console, monospace',
  })

  constructor() {
    this.apply()
  }

  apply = () => {
    if (browser) {
      Object.keys(this.detail).forEach((prop) => {
        const value = this.detail[prop]
        if (value && value.rgba) {
          document.documentElement.style.setProperty(`--${prop}`, value.toHex())
        } else {
          document.documentElement.style.setProperty(`--${prop}`, value)
        }
      })
    }
  }
}
