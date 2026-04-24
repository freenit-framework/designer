import { describe, expect, test } from 'vitest'
import { JSDOM } from 'jsdom'
import { createHtmlImporter } from './import-html.js'

describe('createHtmlImporter', () => {
  test('maps inline style attribute to component css and removes style prop', () => {
    const dom = new JSDOM(`
      <html lang="en">
        <head><title>Sample</title></head>
        <body>
          <main id="root" style="color: red; margin-top: 12px; --accent: #ff0;">
            hello
          </main>
        </body>
      </html>
    `)

    const payload = createHtmlImporter(dom.window.document)
    const main = payload.design[0]

    expect(main.name).toBe('Main')
    expect(main.props).toEqual({ id: 'root' })
    expect(main.css).toEqual({
      color: 'red',
      'margin-top': '12px',
      '--accent': '#ff0',
    })
  })

  test('ignores malformed inline css declarations', () => {
    const dom = new JSDOM(`
      <html>
        <head></head>
        <body>
          <div style="bad; a:; :b; display:flex"></div>
        </body>
      </html>
    `)

    const payload = createHtmlImporter(dom.window.document)
    const div = payload.design[0]

    expect(div.css).toEqual({ display: 'flex' })
  })
})
