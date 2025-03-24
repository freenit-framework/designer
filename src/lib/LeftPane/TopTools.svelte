<script lang="ts">
  import {
    mdiArrowLeftBold,
    mdiUndo,
    mdiRedo,
    mdiSelectSearch,
    mdiContentCopy,
    mdiContentPaste,
  } from '@mdi/js'
  import { notification } from '@freenit-framework/core'
  import { attachComponents, setColors } from '$lib/utils'
  import store from '$lib/store'
  import { browser } from '$app/environment'
  import type { Component } from '$lib/types'

  let { toggle } = $props()

  const left = (pane: string) => () => {
    store.selected.left = pane
  }

  const right = (pane: string) => () => {
    store.selected.right = pane
  }

  const _search = (children: Component[]): boolean => {
    let ret = false
    children.forEach((component) => {
      component.open = component === store.design.selected
      component.open = component.open || _search(component.children)
      ret = ret || component.open
    })
    return ret
  }

  const search = () => {
    _search(store.design.children)
  }

  const copy = () => {
    if (browser) {
      const value = JSON.stringify(store.design.selected)
      navigator.clipboard.writeText(value)
    }
  }

  const paste = async () => {
    if (browser) {
      const value = await navigator.clipboard.readText()
      let data
      try {
        data = JSON.parse(value)
      } catch (e) {
        notification.error('error parsing paste')
        return
      }
      attachComponents(data)
      setColors(data)
      if (store.design.selected) {
        store.design.selected.children.push(data)
      }
    }
  }
</script>

<div class="views">
  <button
    class="button outline"
    disabled={store.selected.left === 'components'}
    onclick={left('components')}
  >
    Components
  </button>
  <button class="button outline" disabled={store.selected.left === 'icons'} onclick={left('icons')}>
    Icons
  </button>
  <button
    class="button outline"
    disabled={store.selected.right === 'props'}
    onclick={right('props')}
  >
    Props
  </button>
  <button
    class="button outline"
    disabled={store.selected.right === 'theme'}
    onclick={right('theme')}
  >
    Theme
  </button>
  <svg class="icon" role="button" tabindex={0} onclick={toggle} onkeyup={toggle}>
    <path d={mdiArrowLeftBold} />
  </svg>
</div>
<div class="tools">
  <input class="search" bind:value={store.design.filter} />
  <div class="actions">
    <svg
      class="icon"
      class:disabled={store.undo.undolist.length < 1}
      onclick={store.undo.undo}
      role="none"
    >
      <path d={mdiUndo} />
    </svg>
    <svg
      class="icon"
      class:disabled={store.undo.redolist.length < 1}
      onclick={store.undo.redo}
      role="none"
    >
      <path d={mdiRedo} />
    </svg>
    <svg class="icon" onclick={search} role="none">
      <path d={mdiSelectSearch} />
    </svg>
    <svg class="icon" onclick={copy} role="none">
      <path d={mdiContentCopy} />
    </svg>
    <svg class="icon" onclick={paste} role="none">
      <path d={mdiContentPaste} />
    </svg>
  </div>
</div>

<style>
  .views {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: white;
    padding: 5px;
    overflow: hidden;
  }

  .search {
    width: 50%;
  }

  .actions {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .icon {
    width: 26px;
    height: 26px;
    fill: #666;
  }

  .disabled {
    fill: #bbb;
  }

  .tools {
    padding: 5px;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  }
</style>
