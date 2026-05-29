<script lang="ts">
  // @ts-nocheck
  import { onMount } from 'svelte'
  import { base } from '$app/paths'
  import store from '$lib/store'
  import { allowDrop, drop } from '$lib/dnd'

  let iframe: HTMLIFrameElement
  let iframeReady = false

  const serializeValue = (value: any): any => {
    if (value && typeof value.toHex === 'function') {
      return value.toHex()
    }
    return value
  }

  const serializeCss = (css: Record<string, any>): Record<string, any> => {
    const result: Record<string, any> = {}
    for (const [key, value] of Object.entries(css)) {
      result[key] = serializeValue(value)
    }
    return result
  }

  const serializeComponent = (component: any): any => {
    const result: any = {
      id: component.id,
      name: component.name,
      title: component.title || '',
      children: component.children.map(serializeComponent),
      props: serializeCss(component.props),
      css: serializeCss(component.css),
      text: component.text || '',
      open: component.open,
    }
    if (component.media) {
      result.media = {}
      for (const [query, styles] of Object.entries(component.media)) {
        result.media[query] = serializeCss(styles)
      }
    }
    return result
  }

  const serializeTheme = (theme: Record<string, any>): Record<string, any> => {
    const result: Record<string, any> = {}
    for (const [key, value] of Object.entries(theme)) {
      result[key] = serializeValue(value)
    }
    return result
  }

  const serializeDocument = (doc: any): any => {
    if (!doc) return null
    return {
      includeChota: doc.includeChota,
      htmlProps: { ...doc.htmlProps },
      bodyProps: { ...doc.bodyProps },
      head: Array.isArray(doc.head) ? [...doc.head] : [],
      bodyAppend: Array.isArray(doc.bodyAppend) ? [...doc.bodyAppend] : [],
      rawBody: doc.rawBody || '',
    }
  }

  const postState = () => {
    if (!iframeReady || !iframe?.contentWindow) return
    iframe.contentWindow.postMessage(
      {
        type: 'update',
        design: store.design.children.map(serializeComponent),
        themeLight: serializeTheme(store.theme.light),
        themeDark: serializeTheme(store.theme.dark),
        themeMode: store.theme.mode,
        device: store.design.device,
        selectedId: store.design.selected?.id || null,
        document: serializeDocument(store.design.document),
      },
      '*'
    )
  }

  onMount(() => {
    const handleMessage = (event) => {
      if (event.source !== iframe?.contentWindow) return

      if (event.data?.type === 'ready') {
        iframeReady = true
        postState()
      }

      if (event.data?.type === 'select') {
        const find = (children, id) => {
          for (const c of children) {
            if (c.id === id) return c
            const found = find(c.children, id)
            if (found) return found
          }
          return null
        }
        store.design.selected = find(store.design.children, event.data.id)
      }

      if (event.data?.type === 'drop') {
        const json = event.data.data || ''
        if (!json) return
        const eventMock = new Event('drop', { bubbles: true, cancelable: true })
        eventMock.preventDefault = () => {}
        eventMock.stopPropagation = () => {}
        eventMock.dataTransfer = { getData: () => json }
        drop(store.design)(eventMock)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  })

  $effect(() => {
    // reactive dependencies: any of these change => postState
    store.design.children
    store.theme.light
    store.theme.dark
    store.theme.mode
    store.design.device
    store.design.selected?.id
    store.design.document
    postState()
  })
</script>

<div class="padding" ondragover={allowDrop} ondrop={drop(store.design)} role="none">
  <iframe
    bind:this={iframe}
    src="{base}/preview/"
    title="preview"
    class="preview-frame"
    class:mobile={store.design.device === 'mobile'}
    class:tablet={store.design.device === 'tablet'}
  ></iframe>
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

  .preview-frame {
    border: none;
    width: 100%;
    height: 100%;
    background-color: white;
  }

  .preview-frame.mobile {
    width: 375px;
    height: 667px;
  }

  .preview-frame.tablet {
    width: 960px;
    height: 600px;
  }
</style>
