<script lang="ts">
  import Tree from './Tree.svelte'
  import Props from './Props.svelte'
  import Theme from './Theme.svelte'
  import {
    mdiRedo,
    mdiUndo,
    mdiCellphone,
    mdiTablet,
    mdiLaptop,
    mdiSelectSearch,
    mdiArrowLeftBold,
    mdiArrowRightBold,
  } from '@mdi/js'
  import { undo, redo } from '$lib/undo'
  import { findSelected } from '$lib/utils'
  import { design, device } from '$lib/store'

  let tab = 'props'
  let hidden = false

  $: rootClass = hidden ? 'root-hidden' : 'root'
  $: panelClass = hidden ? 'panel-hidden' : 'panel'
  $: hideIcon = hidden ? mdiArrowLeftBold : mdiArrowRightBold

  function setDevice(d: string) {
    function handler() {
      $device = d
    }
    return handler
  }

  function props() {
    tab = 'props'
  }

  function theme() {
    tab = 'theme'
  }

  function search() {
    findSelected($design)
    $design = $design
  }

  function toggleHide() {
    hidden = !hidden
  }
</script>

<div class={rootClass}>
  <div class={panelClass}>
    <svg class="icon" on:click={toggleHide} on:keypress={toggleHide}>
      <path d={hideIcon} />
    </svg>
    {#if !hidden}
      <button
        class="button outline"
        disabled={tab === 'props'}
        on:click={props}
      >
        Props
      </button>
      <button
        class="button outline"
        disabled={tab === 'theme'}
        on:click={theme}
      >
        Theme
      </button>
    {/if}
  </div>
  {#if !hidden}
    {#if tab === 'props'}
      <div class="tools">
        <svg class="icon" on:click={undo} on:keypress={undo}>
          <path d={mdiUndo} />
        </svg>
        <svg class="icon" on:click={redo} on:keypress={redo}>
          <path d={mdiRedo} />
        </svg>
        <svg class="icon" on:click={search} on:keypress={search}>
          <path d={mdiSelectSearch} />
        </svg>
      </div>
      <div class="content">
        <Tree />
        <Props />
      </div>
    {:else if tab === 'theme'}
      <div class="tools">
        <svg class="icon" on:click={undo} on:keypress={undo}>
          <path d={mdiUndo} />
        </svg>
        <svg class="icon" on:click={redo} on:keypress={redo}>
          <path d={mdiRedo} />
        </svg>
      </div>
      <div class="content">
        <Theme />
      </div>
    {/if}
    <div class="buttons">
      <svg
        class="icon"
        on:click={setDevice('mobile')}
        on:keypress={setDevice('mobile')}
      >
        <path d={mdiCellphone} />
      </svg>
      <svg
        class="icon"
        on:click={setDevice('tablet')}
        on:keypress={setDevice('tablet')}
      >
        <path d={mdiTablet} />
      </svg>
      <svg
        class="icon"
        on:click={setDevice('desktop')}
        on:keypress={setDevice('desktop')}
      >
        <path d={mdiLaptop} />
      </svg>
    </div>
  {/if}
</div>

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
    border-left: 1px solid #ddd;
  }

  .root-hidden {
    width: 300px;
    max-width: 50px;
    height: 100%;
    overflow: hidden;
    transition: all 1s;
    border-left: 1px solid #ddd;
  }

  .panel {
    height: 58px;
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

  .tools {
    height: 37px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
  }

  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: calc(100% - 58px - 37px - 64px);
  }

  .buttons {
    height: 64px;
    width: 100%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: white;
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

  .hide {
    width: 30px;
    padding: 10px;
  }
</style>
