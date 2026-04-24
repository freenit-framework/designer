// @ts-nocheck
function renderValue(value) {
  if (value && typeof value === 'object' && typeof value.toHex === 'function') {
    return value.toHex()
  }

  return value
}

const IDENTIFIER_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/
const NO_CHILDREN_ELEMENTS = new Set([
  'img',
  'hr',
  'br',
  'wbr',
  'area',
  'base',
  'col',
  'embed',
  'input',
  'link',
  'param',
  'source',
  'track',
  'textarea',
])
const NO_PROPS_ELEMENTS = new Set(['textarea', 'br'])
const VOID_ELEMENTS = new Set(['br'])

function escapeSingleQuoted(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

function canHaveChildren(tagName) {
  return !NO_CHILDREN_ELEMENTS.has(tagName)
}

function canHaveProps(tagName) {
  return !NO_PROPS_ELEMENTS.has(tagName)
}

function isVoid(tagName) {
  return VOID_ELEMENTS.has(tagName)
}

function getIconName(component) {
  const title = component?.title
  if (typeof title !== 'string') {
    return null
  }

  const trimmed = title.trim()
  if (!trimmed || !IDENTIFIER_RE.test(trimmed)) {
    return null
  }

  return trimmed
}

function calculateDataNode(component) {
  let ret = ''
  const tagName = component.name.toLowerCase()
  if (canHaveChildren(tagName) && component.text) {
    ret += `    '${escapeSingleQuoted(component.id)}': '${escapeSingleQuoted(component.text)}',\n`
  }
  if (canHaveChildren(tagName)) {
    for (const child of component.children) {
      ret += calculateDataNode(child)
    }
  }
  return ret
}

export function calculateData(design) {
  let ret = ''
  for (const component of design) {
    ret += calculateDataNode(component)
  }
  return ret
}

function calculateCssNode(component) {
  let ret = ''
  const keys = Object.keys(component.css)
  if (keys.length > 0) {
    ret += `\n  .${component.id} {\n`
    for (const key of keys) {
      ret += `    ${key}: ${renderValue(component.css[key])};\n`
    }
    ret += '  }\n'
  }
  for (const child of component.children) {
    ret += calculateCssNode(child)
  }
  return ret
}

export function calculateCss(design) {
  let ret = ''
  for (const component of design) {
    ret += calculateCssNode(component)
  }
  return ret
}

function calculateComponentNode(component, level = 0) {
  const tagName = component.name.toLowerCase()
  const allowChildren = canHaveChildren(tagName)
  const allowProps = canHaveProps(tagName)
  const elementIsVoid = isVoid(tagName)
  const selfClosing = elementIsVoid || (!allowChildren && allowProps)
  let ret = ' '.repeat(level)
  ret += `<${tagName}`
  if (allowProps && Object.keys(component.css).length > 0) {
    ret += ` class="${component.id}"`
  }
  if (allowProps) {
    for (const prop in component.props) {
      if (component.name === 'Path' && prop === 'd') {
        const iconName = getIconName(component)
        if (iconName) {
          ret += ` ${prop}={${iconName}}`
        } else {
          ret += ` ${prop}="${component.props[prop]}"`
        }
      } else {
        ret += ` ${prop}="${component.props[prop]}"`
      }
    }
  }
  if (selfClosing) {
    ret += ' />\n'
    return ret
  }
  ret += '>\n'
  if (allowChildren) {
    for (const child of component.children) {
      ret += calculateComponentNode(child, level + 2)
    }
    if (component.text) {
      ret += ' '.repeat(level + 2)
      ret += `{data['${escapeSingleQuoted(component.id)}']}\n`
    }
  }
  ret += ' '.repeat(level)
  ret += `</${tagName}>\n`
  return ret
}

export function calculateComponents(design) {
  let ret = ''
  for (const component of design) {
    ret += calculateComponentNode(component)
  }
  return ret
}

export function calculateTheme(theme) {
  let ret = '  :root {\n'
  for (const prop in theme) {
    ret += `    --${prop}: ${renderValue(theme[prop])};\n`
  }
  ret += '  }\n'
  return ret
}

function collectImportsNode(component, icons) {
  if (component.name === 'Svg') {
    const iconName = getIconName(component)
    if (iconName) {
      icons.add(iconName)
    }
  }
  for (const child of component.children) {
    collectImportsNode(child, icons)
  }
}

export function calculateImports(design) {
  const icons = new Set()
  for (const component of design) {
    collectImportsNode(component, icons)
  }
  if (icons.size === 0) {
    return ''
  }

  const imports = Array.from(icons).sort().join(', ')
  return `  import { ${imports} } from '@mdi/js'\n`
}

function calculateGlobalCss(documentData) {
  if (!Array.isArray(documentData?.head)) {
    return ''
  }

  let ret = ''
  for (const entry of documentData.head) {
    if (typeof entry !== 'string') {
      continue
    }

    const matches = entry.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)
    for (const match of matches) {
      const css = match[1]?.trim()
      if (!css) {
        continue
      }

      ret += `${css}\n`
    }
  }

  return ret.trim()
}

export function renderSvelte(design, theme, documentData = null) {
  let output = '<script lang="ts">\n'
  output += calculateImports(design)
  output += '\n'
  output += '  const data = {\n'
  output += calculateData(design)
  output += '  }\n'
  output += '</script>\n\n'
  output += calculateComponents(design)
  output += '\n'
  output += '<style>\n'
  const globalCss = calculateGlobalCss(documentData)
  if (globalCss) {
    output += '  :global {\n'
    output += `${globalCss}\n`
    output += '  }\n'
  }
  output += calculateTheme(theme)
  output += calculateCss(design)
  output += '</style>\n'
  return output
}
