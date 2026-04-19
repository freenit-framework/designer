<script lang="ts">
  // @ts-nocheck
  import { mdiCellphone, mdiTablet, mdiLaptop } from '@mdi/js'
  import { Base64 } from 'js-base64'
  import { renderSvelte } from '$lib/export'
  import { createHtmlImporter } from '$lib/import-html'
  import store from '$lib/store'
  import { attachComponents, setColors, setThemeColors } from '$lib/utils'
  import type { Component } from '$lib/types'

  let fileInput: any
  let htmlInput: any
  let fileMenu: any
  let saveDownload = $state('')
  let exportDownload = $state('')

  const calculateSave = () => {
    const myjson = {
      design: store.design.children,
      theme: store.theme.detail,
      document: store.design.document,
    }
    const mystring = JSON.stringify(myjson, null, 2)
    saveDownload = `data:application/json;base64,${Base64.encode(mystring)}`
  }

  const calculateExport = () => {
    const mystring = renderSvelte(store.design.children, store.theme.detail)
    exportDownload = `data:application/json;base64,${Base64.encode(mystring)}`
  }

  const applyImportedData = (data: any) => {
    data.design.forEach((component: Component) => attachComponents(component))
    data.design.forEach((component: Component) => setColors(component))
    setThemeColors(data.theme)
    store.design.children = data.design
    store.theme.detail = data.theme
    store.design.document = data.document || {
      includeChota: true,
      htmlProps: { lang: 'en' },
      bodyProps: {},
      head: [],
      bodyAppend: [],
      rawBody: '',
    }
    store.theme.apply()
    store.undo.redolist = []
    store.undo.undolist = []
  }

  const openFile = () => {
    fileMenu?.removeAttribute('open')
    fileInput.click()
  }

  const openImport = () => {
    fileMenu?.removeAttribute('open')
    htmlInput.click()
  }

  const closeFileMenu = () => {
    fileMenu?.removeAttribute('open')
  }

  const load = (event: any) => {
    if (event.target.files.length > 0) {
      const [file] = event.target.files
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = JSON.parse(`${e.target?.result}`)
        applyImportedData(data)
      }
      reader.readAsText(file)
    }
    event.target.value = ''
  }

  const importHtml = (event: any) => {
    if (event.target.files.length > 0) {
      const [file] = event.target.files
      const reader = new FileReader()
      reader.onload = (e) => {
        const html = `${e.target?.result || ''}`
        const parser = new DOMParser()
        const document = parser.parseFromString(html, 'text/html')
        const data = createHtmlImporter(document)
        applyImportedData(data)
      }
      reader.readAsText(file)
    }
    event.target.value = ''
  }

  const cellphone = () => {
    store.design.device = 'mobile'
  }

  const tablet = () => {
    store.design.device = 'tablet'
  }

  const desktop = () => {
    store.design.device = 'desktop'
  }
</script>

<div class="bottom">
  <div class="bottom-actions">
    <details class="file-menu" bind:this={fileMenu}>
      <summary class="button outline">File</summary>
      <div class="file-menu-list">
        <a
          href={saveDownload}
          class="button outline"
          onmouseover={calculateSave}
          onfocus={calculateSave}
          onclick={closeFileMenu}
          download="design.json"
        >
          Save
        </a>
        <button class="button outline primary" onclick={openFile}>Load</button>
        <button class="button outline primary" onclick={openImport}>Import</button>
        <a
          href={exportDownload}
          class="button outline"
          onmouseover={calculateExport}
          onfocus={calculateExport}
          onclick={closeFileMenu}
          download="+page.svelte"
        >
          Export
        </a>
      </div>
    </details>
  </div>
  <div class="bottom-actions">
    <svg class="icon" onclick={cellphone} role="none">
      <path d={mdiCellphone} />
    </svg>
    <svg class="icon" onclick={tablet} role="none">
      <path d={mdiTablet} />
    </svg>
    <svg class="icon" onclick={desktop} role="none">
      <path d={mdiLaptop} />
    </svg>
  </div>
</div>

<input style="display: none" type="file" accept=".json" bind:this={fileInput} onchange={load} />
<input style="display: none" type="file" accept=".html,text/html" bind:this={htmlInput} onchange={importHtml} />

<style>
  .bottom {
    background-color: white;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bottom-actions {
    width: 50%;
    justify-content: space-around;
    align-items: center;
    display: flex;
  }

  .file-menu {
    position: relative;
  }

  .file-menu summary {
    list-style: none;
  }

  .file-menu summary::-webkit-details-marker {
    display: none;
  }

  .file-menu-list {
    position: absolute;
    bottom: calc(100% + 0.8rem);
    left: 0;
    min-width: 14rem;
    padding: 0.8rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    background: white;
    border: 1px solid #d2d6dd;
    border-radius: 0.6rem;
    box-shadow: 0 0.8rem 2rem rgba(27, 36, 51, 0.12);
    z-index: 10;
  }

  .file-menu-list :global(.button) {
    box-sizing: border-box;
    display: flex;
    width: 100%;
    margin: 0;
    justify-content: flex-start;
  }

  .icon {
    width: 26px;
    height: 26px;
    fill: #666;
  }
</style>
