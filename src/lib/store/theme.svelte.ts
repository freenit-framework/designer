import store from '.'
import { compile } from '../utils/props'

export default class ThemeStore {
  detail = $state(
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
}
