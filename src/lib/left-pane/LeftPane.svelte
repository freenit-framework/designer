<script lang="ts">
  import DnD from './DnD.svelte'
  import Icons from './Icons.svelte'
  import Exporter from './Exporter.svelte'
  import { toJson, object2component, setThemeProp } from '$lib/utils'
  import { design, theme } from '$lib/store'
  import { Base64 } from 'js-base64'
  import { mdiArrowLeftBold, mdiArrowRightBold } from '@mdi/js'

  let saveDownload: string | null = null
  let fileInput: any
  let tab = 'components'
  let showExport = false
  let hidden = false

  $: rootClass = hidden ? 'root-hidden' : 'root'
  $: panelClass = hidden ? 'panel-hidden' : 'panel'
  $: hideIcon = hidden ? mdiArrowRightBold : mdiArrowLeftBold

  function save() {
    saveDownload = null
    const data = {
      design: toJson($design),
      theme: $theme,
    }
    const json = JSON.stringify(data, null, 2)
    saveDownload = `data:application/json;base64,${Base64.encode(json)}`
  }

  function exporter() {
    showExport = true
  }

  function openFile() {
    fileInput.click()
  }

  function load(event: any) {
    if (event.target.files.length > 0) {
      const [file] = event.target.files
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = JSON.parse(`${e.target?.result}`)
        $design = object2component(data.design)
        $theme = data.theme
        for (const prop in data.theme) {
          setThemeProp(prop, data.theme[prop])
        }
      }
      reader.readAsText(file)
    }
  }

  function components() {
    tab = 'components'
  }

  function icons() {
    tab = 'icons'
  }

  function toggleHide() {
    hidden = !hidden
  }
</script>

<div class={rootClass}>
  <div class={panelClass}>
    {#if !hidden}
      <button
        class="button outline"
        on:click={components}
        disabled={tab === 'components'}
      >
        Components
      </button>
      <button
        class="button outline"
        on:click={icons}
        disabled={tab === 'icons'}
      >
        Icons
      </button>
    {/if}
    <svg class="icon" on:click={toggleHide}>
      <path d={hideIcon} />
    </svg>
  </div>
  {#if !hidden}
    {#if tab === 'components'}
      <DnD />
    {:else}
      <Icons />
    {/if}
    <div class="buttons">
      <a
        class="button outline"
        on:mouseover={save}
        on:focus={save}
        href={saveDownload}
        download="design.json"
      >
        Save
      </a>
      <button class="button outline primary" on:click={openFile}>Load</button>
      <button class="button outline" on:click={exporter}> Export </button>
    </div>
  {/if}
</div>

<input
  style="display: none"
  type="file"
  accept=".json"
  bind:this={fileInput}
  on:change={load}
/>

<Exporter bind:open={showExport} />

<style>
  .root {
    width: 300px;
    max-width: 300px;
    background-color: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow: hidden;
    transition: all 1s;
  }

  .root-hidden {
    width: 300px;
    max-width: 50px;
    height: 100%;
    overflow: hidden;
    transition: all 1s;
  }

  .panel {
    width: 100%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
  }

  .panel-hidden {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background-color: white;
    padding-top: 10px;
  }

  .buttons {
    width: 100%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: white;
  }

  .hide {
    width: 30px;
    padding: 10px;
  }

  .icon {
    height: 26px;
    width: 26px;
    margin: 0px 5px;
    fill: #666;
  }

  .icon:hover {
    fill: black;
  }
</style>
