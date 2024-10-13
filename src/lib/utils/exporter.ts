import { get } from 'svelte/store'
import { Base64 } from 'js-base64'
import type { Component } from '$lib/types'
import { design, theme } from '$lib/store'
import { decompile } from './props'

function exportSvelteCode(component: Component, prefix = ''): string {
  const oldprefix = prefix
  const element = component.name.toLowerCase()
  let ret = `${prefix}<${element} class="${component.id}"`
  ret += exportProps(decompile(component.props))
  ret += '>\n'
  if (element === 'svg') {
    prefix += '  '
    ret += `${prefix}<path d="${component.data}"`
    ret += exportProps(decompile(component.props))
    ret += ' />\n'
  }
  const children = component.children.map((c) =>
    exportSvelteCode(c, `${prefix}  `),
  )
  ret += children.join('')
  if (component.text !== '') {
    ret += `${oldprefix}  {data.${component.id}}\n`
  }
  ret += `${oldprefix}</${element}>\n`
  return ret
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
  ret += component.children.map((c) => exportStyle(c)).join('')
  return ret
}

export function exportText(component: Component, indent = 4): string {
  let ret = ''
  if (component.text !== '') {
    ret += '\n'
    ret += ' '.repeat(indent)
    ret += `${component.id}: "${component.text}",`
  }
  ret += component.children.map((c) => exportText(c, indent)).join('')
  return ret
}

export function exportSvelte(): string {
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
