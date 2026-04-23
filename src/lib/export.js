// @ts-nocheck
function renderValue(value) {
  if (value && typeof value === 'object' && typeof value.toHex === 'function') {
    return value.toHex()
  }

  return value
}

const IDENTIFIER_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/

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
  if (component.text) {
    ret += `    '${component.id}': '${component.text}',\n`
  }
  for (const child of component.children) {
    ret += calculateDataNode(child)
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
  let ret = ' '.repeat(level)
  ret += `<${component.name.toLowerCase()}`
  if (Object.keys(component.css).length > 0) {
    ret += ` class="${component.id}"`
  }
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
  ret += '>\n'
  for (const child of component.children) {
    ret += calculateComponentNode(child, level + 2)
  }
  if (component.text) {
    ret += ' '.repeat(level + 2)
    ret += `{data['${component.id}']}\n`
  }
  ret += ' '.repeat(level)
  ret += `</${component.name.toLowerCase()}>\n`
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

export function renderSvelte(design, theme) {
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
  output += calculateTheme(theme)
  output += calculateCss(design)
  output += '</style>\n'
  return output
}
