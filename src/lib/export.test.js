import { describe, expect, test } from 'vitest'
import { calculateImports, renderSvelte } from './export.js'

describe('export helpers', () => {
  test('skips empty svg titles from mdi imports', () => {
    const design = [{ name: 'Svg', title: '', children: [] }]
    expect(calculateImports(design)).toBe('')
  })

  test('deduplicates and sorts valid mdi imports', () => {
    const design = [
      { name: 'Svg', title: 'mdiZebra', children: [] },
      {
        name: 'Div',
        children: [
          { name: 'Svg', title: 'mdiApple', children: [] },
          { name: 'Svg', title: 'mdiZebra', children: [] },
        ],
      },
    ]

    expect(calculateImports(design)).toBe("  import { mdiApple, mdiZebra } from '@mdi/js'\n")
  })

  test('keeps path d literal when icon title is missing', () => {
    const design = [
      {
        id: 'svg1',
        name: 'Svg',
        title: '',
        props: {},
        css: {},
        text: '',
        children: [
          {
            id: 'path1',
            name: 'Path',
            title: '',
            props: { d: 'M1 2 3 4' },
            css: {},
            text: '',
            children: [],
          },
        ],
      },
    ]

    const output = renderSvelte(design, {})
    expect(output).toContain('<path d="M1 2 3 4">')
    expect(output).not.toContain('<path d={}>')
  })
})
