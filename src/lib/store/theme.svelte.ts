import { colord } from 'colord'
import { browser } from '$app/environment'

export default class ThemeStore {
  detail = $state({
    'bg-color': colord('#ffffff'),
    'bg-secondary-color': colord('#f3f3f6'),
    'color-primary': colord('#14854F'),
    'color-lightGrey': colord('#d2d6dd'),
    'color-grey': colord('#747681'),
    'color-darkGrey': colord('#3f4144'),
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
