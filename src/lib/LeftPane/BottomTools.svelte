<script lang="ts">
  import { mdiCellphone, mdiTablet, mdiLaptop } from '@mdi/js'
  import { Base64 } from 'js-base64'
  import store from '$lib/store'
  import {
    attachComponents,
    calculateComponents,
    calculateCss,
    calculateData,
    calculateImports,
    calculateTheme,
    setColors,
    setThemeColors,
  } from '$lib/utils'
  import type { Component } from '$lib/types'

  let fileInput: any
  let saveDownload = $state('')
  let exportDownload = $state('')

  const calculateSave = () => {
    const myjson = { design: store.design.children, theme: store.theme.detail }
    const mystring = JSON.stringify(myjson, null, 2)
    saveDownload = `data:application/json;base64,${Base64.encode(mystring)}`
  }

  const calculateExport = () => {
    let mystring = '<script lang="ts">\n'
    mystring += calculateImports()
    mystring += '\n'
    mystring += '  const data = {\n'
    mystring += calculateData()
    mystring += '  }\n'
    mystring += '<\/script>\n\n'

    mystring += calculateComponents()
    mystring += '\n'

    mystring += '<style>\n'
    mystring += calculateTheme()
    mystring += calculateCss()
    mystring += '<\/style>\n\n'

    exportDownload = `data:application/json;base64,${Base64.encode(mystring)}`
  }

  const openFile = () => {
    fileInput.click()
  }

  const load = (event: any) => {
    if (event.target.files.length > 0) {
      const [file] = event.target.files
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = JSON.parse(`${e.target?.result}`)
        data.design.forEach((component: Component) => attachComponents(component))
        data.design.forEach((component: Component) => setColors(component))
        setThemeColors(data.theme)
        store.design.children = data.design
        store.theme.detail = data.theme
        store.theme.apply()
      }
      reader.readAsText(file)
    }
    store.undo.redolist = []
    store.undo.undolist = []
  }
</script>

<div class="bottom">
  <div class="bottom-actions">
    <a
      href={saveDownload}
      class="button outline"
      onmouseover={calculateSave}
      onfocus={calculateSave}
      download="design.json"
    >
      Save
    </a>
    <button class="button outline primary" onclick={openFile}>Load</button>
    <a
      href={exportDownload}
      class="button outline"
      onmouseover={calculateExport}
      onfocus={calculateExport}
      download="+page.svelte"
    >
      Export
    </a>
  </div>
  <div class="bottom-actions">
    <svg class="icon">
      <path d={mdiCellphone} />
    </svg>
    <svg class="icon">
      <path d={mdiTablet} />
    </svg>
    <svg class="icon">
      <path d={mdiLaptop} />
    </svg>
  </div>
</div>

<input style="display: none" type="file" accept=".json" bind:this={fileInput} onchange={load} />

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

  .icon {
    width: 26px;
    height: 26px;
    fill: #666;
  }
</style>
