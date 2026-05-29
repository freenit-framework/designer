// @ts-nocheck

const defaultTheme = {
  'bg-color': '#ffffff',
  'bg-secondary-color': '#f5f7fb',
  'color-primary': '#2f63f0',
  'color-lightGrey': '#d9e0eb',
  'color-grey': '#60708a',
  'color-darkGrey': '#1b2433',
  'color-error': '#d43939',
  'color-success': '#28bd14',
  'grid-maxWidth': '120rem',
  'grid-gutter': '2rem',
  'font-size': '1.6rem',
  'font-color': '#333333',
  'font-family-sans': 'sans-serif',
  'font-family-mono': "monaco, 'Consolas', 'Lucida Console', monospace",
}

const defaultDarkTheme = {
  'bg-color': '#1b2433',
  'bg-secondary-color': '#2a3546',
  'color-primary': '#5b8bf7',
  'color-lightGrey': '#3a4a5e',
  'color-grey': '#8a9ab0',
  'color-darkGrey': '#d9e0eb',
  'color-error': '#e85d5d',
  'color-success': '#4cd137',
  'grid-maxWidth': '120rem',
  'grid-gutter': '2rem',
  'font-size': '1.6rem',
  'font-color': '#e0e6ed',
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

  function parseInlineStyle(styleValue) {
    const css = {}
    if (!styleValue || typeof styleValue !== 'string') {
      return css
    }

    for (const declaration of styleValue.split(';')) {
      const trimmed = declaration.trim()
      if (!trimmed) {
        continue
      }

      const separator = trimmed.indexOf(':')
      if (separator === -1) {
        continue
      }

      const prop = trimmed.slice(0, separator).trim()
      const value = trimmed.slice(separator + 1).trim()
      if (!prop || !value) {
        continue
      }

      css[prop] = value
    }

    return css
  }

  function attributeMap(element) {
    const props = {}
    for (const attr of element.attributes) {
      if (attr.name === 'style') {
        continue
      }
      props[attr.name] = attr.value
    }
    return props
  }

  function extractThemeFromDocument() {
    const theme = { ...defaultTheme }
    const styleElements = Array.from(document.querySelectorAll('style'))

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

  function parseDeclarations(declarations) {
    const properties = {}
    for (const decl of declarations.split(';')) {
      const trimmed = decl.trim()
      if (!trimmed) {
        continue
      }
      const separator = trimmed.indexOf(':')
      if (separator === -1) {
        continue
      }
      const prop = trimmed.slice(0, separator).trim()
      const value = trimmed.slice(separator + 1).trim()
      if (prop && value && !prop.startsWith('--')) {
        properties[prop] = value
      }
    }
    return properties
  }

  function parseRulesInBlock(cssText, media) {
    const rules = []
    let i = 0
    while (i < cssText.length) {
      while (i < cssText.length && /\s/.test(cssText[i])) i++
      if (i >= cssText.length) break

      const ruleStart = i
      while (i < cssText.length && cssText[i] !== '{') i++
      if (i >= cssText.length) break
      const selector = cssText.slice(ruleStart, i).trim()
      i++ // skip {

      let braceDepth = 1
      const declStart = i
      while (i < cssText.length && braceDepth > 0) {
        if (cssText[i] === '{') braceDepth++
        else if (cssText[i] === '}') braceDepth--
        i++
      }
      const declarations = cssText.slice(declStart, i - 1)
      const properties = parseDeclarations(declarations)
      if (Object.keys(properties).length > 0) {
        rules.push({ selector, media, properties })
      }
    }
    return rules
  }

  function parseStyleSheetFallback(cssText) {
    const rules = []
    if (!cssText) return rules

    cssText = cssText.replace(/\/\*[\s\S]*?\*\//g, '')

    let i = 0
    while (i < cssText.length) {
      while (i < cssText.length && /\s/.test(cssText[i])) i++
      if (i >= cssText.length) break

      if (cssText[i] === '@') {
        const atStart = i
        while (i < cssText.length && cssText[i] !== ' ' && cssText[i] !== '{') i++
        const atRule = cssText.slice(atStart, i).trim()

        while (i < cssText.length && cssText[i] !== '{') i++
        if (i >= cssText.length) break
        i++ // skip {

        if (atRule === '@media') {
          const mediaCondition = cssText.slice(atStart + 6, i - 1).trim()
          const media = `@media ${mediaCondition}`

          let braceDepth = 1
          const blockStart = i
          while (i < cssText.length && braceDepth > 0) {
            if (cssText[i] === '{') braceDepth++
            else if (cssText[i] === '}') braceDepth--
            i++
          }
          const block = cssText.slice(blockStart, i - 1)
          rules.push(...parseRulesInBlock(block, media))
        } else {
          let braceDepth = 1
          while (i < cssText.length && braceDepth > 0) {
            if (cssText[i] === '{') braceDepth++
            else if (cssText[i] === '}') braceDepth--
            i++
          }
        }
      } else {
        const ruleStart = i
        while (i < cssText.length && cssText[i] !== '{') i++
        if (i >= cssText.length) break
        const selector = cssText.slice(ruleStart, i).trim()
        i++ // skip {

        let braceDepth = 1
        const declStart = i
        while (i < cssText.length && braceDepth > 0) {
          if (cssText[i] === '{') braceDepth++
          else if (cssText[i] === '}') braceDepth--
          i++
        }
        const declarations = cssText.slice(declStart, i - 1)
        const properties = parseDeclarations(declarations)
        if (Object.keys(properties).length > 0) {
          rules.push({ selector, media: null, properties })
        }
      }
    }

    return rules
  }

  function extractRulesFromSheet(styleEl) {
    const rules = []
    try {
      const sheet = styleEl.sheet
      if (!sheet || !sheet.cssRules) return rules

      for (const rule of sheet.cssRules) {
        if (rule.type === 1) {
          // STYLE_RULE
          const props = {}
          for (let i = 0; i < rule.style.length; i++) {
            const prop = rule.style.item(i)
            if (prop.startsWith('--')) continue
            props[prop] = rule.style.getPropertyValue(prop)
          }
          if (Object.keys(props).length > 0) {
            rules.push({ selector: rule.selectorText, media: null, properties: props })
          }
        } else if (rule.type === 4) {
          // MEDIA_RULE
          for (const mediaRule of rule.cssRules) {
            if (mediaRule.type === 1) {
              const props = {}
              for (let i = 0; i < mediaRule.style.length; i++) {
                const prop = mediaRule.style.item(i)
                if (prop.startsWith('--')) continue
                props[prop] = mediaRule.style.getPropertyValue(prop)
              }
              if (Object.keys(props).length > 0) {
                rules.push({
                  selector: mediaRule.selectorText,
                  media: `@media ${rule.media.mediaText}`,
                  properties: props,
                })
              }
            }
          }
        }
      }
    } catch (e) {
      // CSSOM access might throw
    }
    return rules
  }

  function extractCssRules(document) {
    const rules = []
    const styleElements = document.querySelectorAll('style')

    for (const styleEl of styleElements) {
      const sheetRules = extractRulesFromSheet(styleEl)
      if (sheetRules.length > 0) {
        rules.push(...sheetRules)
        continue
      }
      const fallbackRules = parseStyleSheetFallback(styleEl.textContent || '')
      rules.push(...fallbackRules)
    }

    return rules
  }

  function applyCssRulesToComponents(rules, document, domToComponent) {
    for (const { selector, media, properties } of rules) {
      try {
        const elements = document.querySelectorAll(selector)
        for (const el of elements) {
          const component = domToComponent.get(el)
          if (!component) continue

          if (media) {
            if (!component.media) component.media = {}
            if (!component.media[media]) component.media[media] = {}
            Object.assign(component.media[media], properties)
          } else {
            for (const [prop, val] of Object.entries(properties)) {
              if (!(prop in component.css)) {
                component.css[prop] = val
              }
            }
          }
        }
      } catch (e) {
        // Invalid selector, skip
      }
    }
  }

  const domToComponent = new WeakMap()

  function textToSpan(text) {
    return {
      name: 'Span',
      id: makeId('Text'),
      title: '',
      children: [],
      props: {},
      css: {},
      media: {},
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
      css: parseInlineStyle(element.getAttribute('style')),
      media: {},
      text: '',
      open: true,
    }

    domToComponent.set(element, component)

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

  const cssRules = extractCssRules(document)
  applyCssRulesToComponents(cssRules, document, domToComponent)

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
    theme: {
      light: extractThemeFromDocument(),
      dark: defaultDarkTheme,
    },
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
