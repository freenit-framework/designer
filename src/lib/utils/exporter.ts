import { get } from 'svelte/store'
import { Base64 } from 'js-base64'
import type { Component } from '$lib/types'
import { design, theme } from '$lib/store'
import { decompile } from './props'

function exportSvelte(): string {
  const designData = get(design)
  const themeData = decompile(get(theme))
  const text = designData.children.map((c) => exportText(c)).join('')
  const children = designData.children
    .map((c) => exportSvelteCode(c, ''))
    .join('')
  const style = designData.children.map((c) => exportStyle(c)).join('\n')
  const scriptData = `\<script lang="ts"\>\n  const data = {${text}\n  }\n\<\/script\>`
  const childrenData = `\n\n${children}\n`
  let globalStyle = `  :global(:root) {\n`
  for (const prop of Object.keys(themeData)) {
    globalStyle += `    --${prop}: ${themeData[prop]};\n`
  }
  globalStyle += '  }\n'
  const styleData = `\<style\>\n${globalStyle}${style}\<\/style\>\n`
  const code = `${scriptData}${childrenData}${styleData}`
  return `data:application/json;base64,${Base64.encode(code)}`
}

function exportReactCode(component: Component, indent: number): string {
  const element = component.name.toLowerCase()
  let code = ' '.repeat(indent)
  code += `<${element}`
  const cssData = decompile(component.style)
  if (Object.keys(cssData).length > 0) {
    const css = JSON.stringify(cssData)
    code += ` style={${css}}`
  }
  code += exportProps(decompile(component.props))
  code += `>\n`
  code += component.children
    .map((child) => exportReactCode(child, indent + 2))
    .join('')
  if (component.text !== '') {
    code += ' '.repeat(indent + 2)
    code += `{data.${component.id}}\n`
  }
  code += ' '.repeat(indent)
  code += `</${element}>\n`
  return code
}

function exportReact(): string {
  const designData = get(design)
  let code = 'import React from "react"\n\n'
  const text = designData.children.map((c) => exportText(c, 2)).join('')
  code += `const data = {${text}\n}\n\n`
  const themeData = decompile(get(theme))
  let jsTheme = ''
  let cssTheme = '/* Put this into main CSS file instead of setProperty calls'
  cssTheme += '\n:root {\n'
  for (const prop of Object.keys(themeData)) {
    const value = themeData[prop]
    jsTheme += `document.documentElement.style.setProperty('--${prop}', '${value}')\n`
    cssTheme += `  --${prop}: ${value}\n`
  }
  code += `${cssTheme}} */\n\n`
  code += `${jsTheme}\n`
  code += 'class Page extends React.Component {\n'
  code += '  render() {\n'
  code += '    return (\n'
  code += '      <>\n'
  const childrenCode = designData.children
    .map((child) => exportReactCode(child, 8))
    .join('')
  code += childrenCode
  code += '      </>\n'
  code += '    )\n'
  code += '  }\n'
  code += '}\n\n'
  code += 'export default Page'
  return `data:application/json;base64,${Base64.encode(code)}`
}

function exportReactFunctional(): string {
  const designData = get(design)
  let code = 'import React from "react"\n\n'
  const text = designData.children.map((c) => exportText(c, 2)).join('')
  code += `const data = {${text}\n}\n\n`
  const themeData = decompile(get(theme))
  let jsTheme = ''
  let cssTheme = '/* Put this into main CSS file instead of setProperty calls'
  cssTheme += '\n:root {\n'
  for (const prop of Object.keys(themeData)) {
    const value = themeData[prop]
    jsTheme += `document.documentElement.style.setProperty('--${prop}', '${value}')\n`
    cssTheme += `  --${prop}: ${value}\n`
  }
  code += `${cssTheme}} */\n\n`
  code += `${jsTheme}\n`
  code += 'function Page(props) {\n'
  code += '  return (\n'
  code += '    <>\n'
  const childrenCode = designData.children
    .map((child) => exportReactCode(child, 6))
    .join('')
  code += childrenCode
  code += '    </>\n'
  code += '  )\n'
  code += '}\n\n'
  code += 'export default Page'
  return `data:application/json;base64,${Base64.encode(code)}`
}

export function exportProps(props: Record<string, any>): string {
  let ret = ''
  for (const prop in props) {
    ret += ` ${prop}="${props[prop]}"`
  }
  return ret
}

export function exportStyle(component: Component): string {
  let ret = `\n  .${component.id} {`
  const styleData = decompile(component.style)
  for (const s in styleData) {
    ret += `\n    ${s}: ${styleData[s]};`
  }
  ret += '\n  }\n'
  ret += component.children.map((c) => exportStyle(c)).join()
  return ret
}

export function exportText(component: Component, indent = 4): string {
  if (component.text === '') {
    return ''
  }
  let ret = '\n'
  ret += ' '.repeat(indent)
  ret += `${component.id}: "${component.text}",`
  ret += component.children.map((c) => exportText(c, indent)).join()
  return ret
}

export function exportSvelteCode(component: Component, prefix = ''): string {
  const element = component.name.toLowerCase()
  let ret = `${prefix}<${element} class="${component.id}"`
  ret += exportProps(decompile(component.props))
  ret += `>\n`
  const children = component.children.map((c) =>
    exportSvelteCode(c, `${prefix}  `),
  )
  ret += children.join()
  if (component.text !== '') {
    ret += `${prefix}  {data.${component.id}}\n`
  }
  ret += `${prefix}</${element}>\n`
  return ret
}

export function exporter(framework: string): string {
  if (framework === 'svelte') return exportSvelte()
  else if (framework === 'react') return exportReact()
  else if (framework === 'react functional') return exportReactFunctional()
  throw new Error(`Invalid framework: ${framework}`)
}
