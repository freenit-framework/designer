#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const [, , inputPath] = process.argv

if (!inputPath) {
  console.error('Usage: npm run render:html -- <design.json>')
  process.exit(1)
}

const resolvedInputPath = path.resolve(process.cwd(), inputPath)

let payload
try {
  payload = JSON.parse(fs.readFileSync(resolvedInputPath, 'utf8'))
} catch (error) {
  console.error(`Failed to read or parse JSON from ${resolvedInputPath}`)
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}

const design = Array.isArray(payload?.design) ? payload.design : null
const theme = payload?.theme && typeof payload.theme === 'object' ? payload.theme : {}

if (!design) {
  console.error('Invalid design JSON: top-level "design" must be an array.')
  process.exit(1)
}

const chotaPath = path.resolve(process.cwd(), 'node_modules/chota/dist/chota.min.css')
const chotaCss = fs.existsSync(chotaPath) ? fs.readFileSync(chotaPath, 'utf8') : ''

const voidTags = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

function toTagName(name) {
  return String(name || '').toLowerCase()
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('"', '&quot;')
}

function normalizeCssValue(value) {
  if (value && typeof value === 'object' && value.rgba) {
    const { r, g, b, a } = value.rgba
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }
  return value
}

function renderTheme(themeObject) {
  const lines = Object.entries(themeObject).map(([key, value]) => {
    return `  --${key}: ${normalizeCssValue(value)};`
  })

  return lines.length > 0 ? `:root {\n${lines.join('\n')}\n}` : ''
}

function renderComponentCss(component, chunks = []) {
  const css = component?.css && typeof component.css === 'object' ? component.css : {}
  const cssEntries = Object.entries(css)

  if (component?.id && cssEntries.length > 0) {
    const lines = cssEntries.map(([key, value]) => `  ${key}: ${normalizeCssValue(value)};`)
    chunks.push(`.${component.id} {\n${lines.join('\n')}\n}`)
  }

  const children = Array.isArray(component?.children) ? component.children : []
  for (const child of children) {
    renderComponentCss(child, chunks)
  }

  return chunks
}

function renderAttributes(component) {
  const props = component?.props && typeof component.props === 'object' ? component.props : {}
  const attrs = []
  const propClass = typeof props.class === 'string' ? props.class.trim() : ''
  const cssClass = component?.id && Object.keys(component?.css || {}).length > 0 ? component.id : ''
  const className = [propClass, cssClass].filter(Boolean).join(' ')

  if (className) {
    attrs.push(`class="${escapeAttribute(className)}"`)
  }

  for (const [key, rawValue] of Object.entries(props)) {
    if (key === 'class' || rawValue === false || rawValue == null) {
      continue
    }
    if (rawValue === true) {
      attrs.push(key)
      continue
    }
    attrs.push(`${key}="${escapeAttribute(rawValue)}"`)
  }

  return attrs.length > 0 ? ` ${attrs.join(' ')}` : ''
}

function renderComponent(component, level = 2) {
  const tagName = toTagName(component?.name)
  if (!tagName) {
    return ''
  }

  const indent = ' '.repeat(level)
  const attrs = renderAttributes(component)
  const children = Array.isArray(component?.children) ? component.children : []
  const childMarkup = children.map((child) => renderComponent(child, level + 2)).filter(Boolean)
  const text = component?.text ? escapeHtml(component.text) : ''

  if (voidTags.has(tagName)) {
    return `${indent}<${tagName}${attrs}>`
  }

  if (childMarkup.length === 0 && !text) {
    return `${indent}<${tagName}${attrs}></${tagName}>`
  }

  const inner = []
  if (childMarkup.length > 0) {
    inner.push(...childMarkup)
  }
  if (text) {
    inner.push(`${' '.repeat(level + 2)}${text}`)
  }

  return `${indent}<${tagName}${attrs}>\n${inner.join('\n')}\n${indent}</${tagName}>`
}

const themeCss = renderTheme(theme)
const componentCss = design.flatMap((component) => renderComponentCss(component))
const styleSections = [chotaCss, themeCss, ...componentCss].filter(Boolean)
const bodyMarkup = design.map((component) => renderComponent(component)).filter(Boolean).join('\n')

const html = [
  '<!doctype html>',
  '<html lang="en">',
  '<head>',
  '  <meta charset="utf-8">',
  '  <meta name="viewport" content="width=device-width, initial-scale=1">',
  `  <title>${escapeHtml(path.basename(resolvedInputPath, path.extname(resolvedInputPath)))}</title>`,
  '  <style>',
  styleSections.join('\n\n'),
  '  </style>',
  '</head>',
  '<body>',
  bodyMarkup,
  '</body>',
  '</html>',
].join('\n')

process.stdout.write(`${html}\n`)
