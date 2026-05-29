// @ts-nocheck
import { colord } from 'colord'
import { browser } from '$app/environment'

const defaultDarkTheme = {
  'bg-color': colord('#1b2433'),
  'bg-secondary-color': colord('#2a3546'),
  'color-primary': colord('#5b8bf7'),
  'color-lightGrey': colord('#3a4a5e'),
  'color-grey': colord('#8a9ab0'),
  'color-darkGrey': colord('#d9e0eb'),
  'color-error': colord('#e85d5d'),
  'color-success': colord('#4cd137'),
  'grid-maxWidth': '120rem',
  'grid-gutter': '2rem',
  'font-size': '1.6rem',
  'font-color': colord('#e0e6ed'),
  'font-family-sans': 'sans-serif',
  'font-family-mono': 'monaco, Consolas, Lucida Console, monospace',
}

export default class ThemeStore {
  light = $state({
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

  dark = $state({ ...defaultDarkTheme })
  mode = $state('light')

  constructor() {
    this.apply()
  }

  apply = () => {
    if (browser) {
      const lightLines = Object.entries(this.light).map(([key, value]) => {
        const render = value && value.toHex ? value.toHex() : value
        return `  --${key}: ${render};`
      })

      const darkLines = Object.entries(this.dark).map(([key, value]) => {
        const render = value && value.toHex ? value.toHex() : value
        return `  --${key}: ${render};`
      })

      let css = `.designer-canvas {\n${lightLines.join('\n')}\n}\n`

      if (darkLines.length > 0) {
        css += `\n.designer-canvas[data-theme="dark"] {\n${darkLines.join('\n')}\n}\n`
      }

      let styleEl = document.getElementById('designer-theme-css')
      if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.id = 'designer-theme-css'
        document.head.appendChild(styleEl)
      }
      styleEl.textContent = css
    }
  }
}
