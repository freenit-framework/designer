<script lang="ts">
  import {
    mdiArrowLeftBold,
    mdiUndo,
    mdiRedo,
    mdiSelectSearch,
    mdiContentCopy,
    mdiContentPaste,
  } from '@mdi/js'
  import { notification } from 'freenit'
  import { attachComponents, setColors } from '$lib/utils'
  import store from '$lib/store'
  import { browser } from '$app/environment'
  import type { Component } from '$lib/types'

  let { toggle } = $props()
  const DESIGNER_CLIPBOARD_KEY = 'designer:clipboard'

  const setDesignerClipboard = (value: string) => {
    try {
      localStorage.setItem(DESIGNER_CLIPBOARD_KEY, value)
    } catch (e) {
      // Storage can be unavailable; the system clipboard may still work.
    }
  }

  const getDesignerClipboard = () => {
    try {
      return localStorage.getItem(DESIGNER_CLIPBOARD_KEY)
    } catch (e) {
      return null
    }
  }

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

  const copy = async () => {
    if (browser && store.design.selected) {
      const value = JSON.stringify(store.design.selected)
      setDesignerClipboard(value)
      try {
        await navigator.clipboard?.writeText(value)
      } catch (e) {
        // Browser clipboard writes can be denied; localStorage still supports same-origin tabs.
      }
    }
  }

  const paste = async () => {
    if (browser) {
      const values = []
      try {
        values.push(await navigator.clipboard?.readText())
      } catch (e) {
        // Fall back to the designer clipboard shared through localStorage.
      }
      values.push(getDesignerClipboard())

      let data = null
      for (const value of values) {
        if (!value) {
          continue
        }
        try {
          data = JSON.parse(value)
          break
        } catch (e) {
          // Try the next clipboard source.
        }
      }
      if (!data) {
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
  <button class="button outline" disabled={store.selected.left === 'hoc'} onclick={left('hoc')}>
    HoC
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
    <button class="icon-button" onclick={copy} aria-label="Copy">
      <svg class="icon" role="none">
        <path d={mdiContentCopy} />
      </svg>
    </button>
    <button class="icon-button" onclick={paste} aria-label="Paste">
      <svg class="icon" role="none">
        <path d={mdiContentPaste} />
      </svg>
    </button>
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

  .icon-button {
    border: 0;
    background: transparent;
    padding: 0;
    line-height: 0;
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
