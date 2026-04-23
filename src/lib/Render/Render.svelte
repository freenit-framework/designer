<script lang="ts">
  // @ts-nocheck
  import { onMount } from 'svelte'
  import RenderElement from './Element.svelte'
  import store from '$lib/store'
  import { allowDrop, drop } from '$lib/dnd'

  let root: HTMLDivElement

  const cleanupInjectedNodes = () => {
    document.querySelectorAll('[data-designer-imported]').forEach((node) => node.remove())
  }

  const createManagedNode = (node: Element) => {
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

  const injectMarkup = (markupList: string[], target: HTMLElement) => {
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

    const imported = store.design.document
    const bodyClass = imported?.bodyProps?.class || ''
    root.className = `root ${store.design.device === 'mobile' ? 'mobile' : ''} ${store.design.device === 'tablet' ? 'tablet' : ''} ${bodyClass}`.trim()

    if (Array.isArray(imported?.head)) {
      injectMarkup(imported.head, document.head)
    }

    if (Array.isArray(imported?.bodyAppend)) {
      injectMarkup(imported.bodyAppend, document.body)
    }
  }

  onMount(() => {
    $effect(() => {
      applyImportedDocument()
    })

    return () => {
      cleanupInjectedNodes()
    }
  })
</script>

<div class="padding" ondragover={allowDrop} ondrop={drop(store.design)} role="none">
  <div
    bind:this={root}
    class="root"
    class:mobile={store.design.device === 'mobile'}
    class:tablet={store.design.device === 'tablet'}
    ondragover={allowDrop}
    ondrop={drop(store.design)}
    role="none"
  >
    {#each store.design.children as component}
      <RenderElement {component} />
    {/each}
  </div>
</div>

<style>
  .padding {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background-color: white;
    min-height: 0;
    overflow: auto;
  }

  .root {
    height: 100%;
    width: 100%;
    background-color: white;
    overflow: auto;
  }

  .mobile {
    max-width: 375px;
    max-height: 667px;
  }

  .tablet {
    max-width: 960px;
    max-height: 600px;
  }
</style>
