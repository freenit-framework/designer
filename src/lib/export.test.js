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

  test('escapes single quotes in exported data object', () => {
    const design = [
      {
        id: "hero'quote",
        name: 'Div',
        title: '',
        props: {},
        css: {},
        text: "It's fine",
        children: [],
      },
    ]

    const output = renderSvelte(design, {})
    expect(output).toContain("'hero\\'quote': 'It\\'s fine',")
    expect(output).toContain("{data['hero\\'quote']}")
  })

  test('does not export children/text for nochildren elements and removes props for noprops elements', () => {
    const design = [
      {
        id: 'in1',
        name: 'Input',
        title: '',
        props: { type: 'text', value: 'abc' },
        css: { color: 'red' },
        text: 'hidden text',
        children: [
          {
            id: 'nested',
            name: 'Span',
            title: '',
            props: {},
            css: {},
            text: 'child text',
            children: [],
          },
        ],
      },
      {
        id: 'ta1',
        name: 'Textarea',
        title: '',
        props: { rows: '4' },
        css: { color: 'blue' },
        text: 'textarea text',
        children: [
          {
            id: 'nested2',
            name: 'Span',
            title: '',
            props: {},
            css: {},
            text: 'child text 2',
            children: [],
          },
        ],
      },
      {
        id: 'br1',
        name: 'Br',
        title: '',
        props: { id: 'break' },
        css: { color: 'green' },
        text: '',
        children: [],
      },
    ]

    const output = renderSvelte(design, {})
    expect(output).toContain('<input class="in1" type="text" value="abc" />')
    expect(output).not.toContain('hidden text')
    expect(output).not.toContain('nested')
    expect(output).toContain('<textarea>')
    expect(output).toContain('</textarea>')
    expect(output).not.toContain('rows="4"')
    expect(output).not.toContain('class="ta1"')
    expect(output).toContain('<br />')
    expect(output).not.toContain('id="break"')
    expect(output).not.toContain('class="br1"')
    expect(output).not.toContain("'in1':")
    expect(output).not.toContain("'ta1':")
  })

  test('exports head style content as global css inside style tag', () => {
    const output = renderSvelte(
      [],
      {},
      {
        head: [
          '<title>Test</title>',
          '<style>body { background: red; } .hero { color: blue; }</style>',
        ],
      },
    )

    expect(output).toContain('  :global {')
    expect(output).toContain('body { background: red; } .hero { color: blue; }')
  })
})
