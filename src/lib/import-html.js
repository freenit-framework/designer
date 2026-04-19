// @ts-nocheck

const defaultTheme = {
  'bg-color': '#ffffff',
  'bg-secondary-color': '#f3f3f6',
  'color-primary': '#14854f',
  'color-lightGrey': '#d2d6dd',
  'color-grey': '#747681',
  'color-darkGrey': '#3f4144',
  'color-error': '#d43939',
  'color-success': '#28bd14',
  'grid-maxWidth': '120rem',
  'grid-gutter': '2rem',
  'font-size': '1.6rem',
  'font-color': '#333333',
  'font-family-sans': 'sans-serif',
  'font-family-mono': "monaco, 'Consolas', 'Lucida Console', monospace",
}

export function createHtmlImporter(document) {
  let nextId = 1

  function makeId(prefix) {
    const suffix = String(nextId).padStart(4, '0')
    nextId += 1
    return `${prefix}${suffix}`
  }

  function toComponentName(tagName) {
    const lower = String(tagName || '').toLowerCase()
    if (!lower) {
      return 'Div'
    }
    return `${lower[0].toUpperCase()}${lower.slice(1)}`
  }

  function attributeMap(element) {
    const props = {}
    for (const attr of element.attributes) {
      props[attr.name] = attr.value
    }
    return props
  }

  function extractThemeFromDocument() {
    const theme = { ...defaultTheme }
    const styleElements = Array.from(document.head.querySelectorAll('style'))

    for (const styleElement of styleElements) {
      const css = styleElement.textContent || ''
      for (const key of Object.keys(theme)) {
        const escapedKey = key.replaceAll('-', '\\-')
        const matches = Array.from(
          css.matchAll(new RegExp(`--${escapedKey}\\s*:\\s*([^;]+);`, 'g')),
        )
        const lastMatch = matches.at(-1)
        if (lastMatch?.[1]) {
          theme[key] = lastMatch[1].trim()
        }
      }
    }

    return theme
  }

  function textToSpan(text) {
    return {
      name: 'Span',
      id: makeId('Text'),
      title: '',
      children: [],
      props: {},
      css: {},
      text,
      open: true,
    }
  }

  function elementToComponent(element) {
    const component = {
      name: toComponentName(element.tagName),
      id: makeId(toComponentName(element.tagName)),
      title: '',
      children: [],
      props: attributeMap(element),
      css: {},
      text: '',
      open: true,
    }

    if (component.name === 'Svg' || component.name === 'Path') {
      component.title = element.getAttribute('data-lucide') || ''
    }

    for (const node of element.childNodes) {
      if (node.nodeType === node.ELEMENT_NODE) {
        component.children.push(elementToComponent(node))
        continue
      }

      if (node.nodeType === node.TEXT_NODE) {
        const text = node.textContent?.replace(/\s+/g, ' ').trim()
        if (text) {
          component.children.push(textToSpan(text))
        }
      }
    }

    return component
  }

  const design = []
  for (const node of document.body.childNodes) {
    if (node.nodeType === node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'script') {
      design.push(elementToComponent(node))
    }
  }

  const head = []
  for (const node of document.head.childNodes) {
    if (node.nodeType !== node.ELEMENT_NODE) {
      continue
    }
    const tagName = node.tagName.toLowerCase()
    if (tagName === 'script' || tagName === 'link') {
      continue
    }
    if (tagName === 'meta') {
      const charset = node.getAttribute('charset')
      const name = node.getAttribute('name')
      if (charset?.toLowerCase() === 'utf-8') {
        continue
      }
      if (name === 'viewport') {
        continue
      }
    }
    head.push(node.outerHTML)
  }

  return {
    design,
    theme: extractThemeFromDocument(),
    document: {
      includeChota: true,
      htmlProps: attributeMap(document.documentElement),
      bodyProps: attributeMap(document.body),
      head,
      bodyAppend: [],
      rawBody: '',
    },
  }
}
