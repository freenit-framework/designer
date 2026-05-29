<script lang="ts">
  // @ts-nocheck
  import { onMount } from 'svelte'
  import { colord } from 'colord'
  import * as components from '$lib/components'
  import { calculateCss } from '$lib/style'
  import PreviewElement from './PreviewElement.svelte'

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

  function makeid(length = 8) {
    let result = ''
    for (let i = 0; i < length; ++i) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  function attachComponents(component) {
    if (!component.id) component.id = makeid()
    component.component = components[component.name]
    component.children.forEach((child) => attachComponents(child))
  }

  function setColors(component) {
    Object.keys(component.css).forEach((prop) => {
      const value = component.css[prop]
      if (value && value.rgba) {
        const { rgba } = value
        component.css[prop] = colord(`rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`)
      }
    })
    if (component.media) {
      Object.values(component.media).forEach((css) => {
        Object.keys(css).forEach((prop) => {
          const value = css[prop]
          if (value && value.rgba) {
            const { rgba } = value
            css[prop] = colord(`rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`)
          }
        })
      })
    }
    component.children.forEach((child) => setColors(child))
  }

  let design = $state([])
  let themeLight = $state({})
  let themeDark = $state({})
  let themeMode = $state('light')
  let selectedId = $state(null)
  let bodyClass = $state('')
  let documentState = $state(null)

  const cleanupInjectedNodes = () => {
    document.querySelectorAll('[data-designer-imported]').forEach((node) => node.remove())
  }

  const createManagedNode = (node) => {
    const managed = document.createElement(node.tagName.toLowerCase())
    for (const attr of Array.from(node.attributes)) {
      managed.setAttribute(attr.name, attr.value)
    }
    managed.setAttribute('data-designer-imported', 'true')
    if (node.tagName.toLowerCase() === 'script') {
      managed.textContent = node.textContent
    } else {
      managed.innerHTML = node.innerHTML
    }
    return managed
  }

  const injectMarkup = (markupList, target) => {
    for (const markup of markupList) {
      const template = document.createElement('template')
      template.innerHTML = markup.trim()
      for (const child of Array.from(template.content.children)) {
        target.appendChild(createManagedNode(child))
      }
    }
  }

  const applyImportedDocument = () => {
    cleanupInjectedNodes()
    if (!documentState) return
    if (Array.isArray(documentState.head)) {
      injectMarkup(documentState.head, document.head)
    }
    if (Array.isArray(documentState.bodyAppend)) {
      injectMarkup(documentState.bodyAppend, document.body)
    }
  }

  onMount(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'update') {
        const newDesign = event.data.design || []
        newDesign.forEach((c) => attachComponents(c))
        newDesign.forEach((c) => setColors(c))
        design = newDesign
        themeLight = event.data.themeLight || {}
        themeDark = event.data.themeDark || {}
        themeMode = event.data.themeMode || 'light'
        selectedId = event.data.selectedId || null
        bodyClass = event.data.document?.bodyProps?.class || ''
        documentState = event.data.document || null
      }
    }

    window.addEventListener('message', handleMessage)
    window.parent.postMessage({ type: 'ready' }, '*')

    return () => {
      window.removeEventListener('message', handleMessage)
      cleanupInjectedNodes()
    }
  })

  $effect(() => {
    let styleEl = document.getElementById('preview-css')
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = 'preview-css'
      document.head.appendChild(styleEl)
    }

    const activeTheme = themeMode === 'dark' ? themeDark : themeLight
    const themeLines = Object.entries(activeTheme).map(([key, value]) => {
      const render = value && value.toHex ? value.toHex() : value
      return `  --${key}: ${render};`
    })

    let css = `:root {\n${themeLines.join('\n')}\n}\n`
    css += calculateCss(design)

    if (selectedId) {
      css += `\n[data-testid="${selectedId}"] { border: 1px dotted gray !important; }\n`
    }

    styleEl.textContent = css
  })

  $effect(() => {
    applyImportedDocument()
  })

  const handleClick = (event) => {
    const el = event.target.closest('[data-testid]')
    if (el) {
      event.preventDefault()
      event.stopPropagation()
      window.parent.postMessage({ type: 'select', id: el.dataset.testid }, '*')
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const json = event.dataTransfer
      ? event.dataTransfer.getData('component') || event.dataTransfer.getData('text/plain')
      : ''
    window.parent.postMessage({ type: 'drop', data: json }, '*')
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
  }
</script>

<div class="padding" ondrop={handleDrop} ondragover={handleDragOver} role="none">
  <div class={`root ${bodyClass}`} onclick={handleClick} role="none">
    {#each design as component}
      <PreviewElement {component} />
    {/each}
  </div>
</div>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  .padding {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background-color: white;
    overflow: auto;
  }

  .root {
    height: 100%;
    width: 100%;
    background-color: white;
    overflow: auto;
  }
</style>
