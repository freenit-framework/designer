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
  const LOG_PREFIX = '[designer clipboard]'

  const describeComponent = (component: Component | null) => {
    if (!component) {
      return null
    }
    return {
      id: component.id,
      name: component.name,
      title: component.title,
      childCount: component.children?.length ?? 0,
      text: component.text,
    }
  }

  const describePasteTarget = (component: Component | null) => {
    if (component) {
      return describeComponent(component)
    }
    return {
      id: store.design.id,
      name: store.design.name,
      title: store.design.title,
      childCount: store.design.children.length,
      root: true,
    }
  }

  const setDesignerClipboard = (value: string) => {
    try {
      localStorage.setItem(DESIGNER_CLIPBOARD_KEY, value)
      console.log(LOG_PREFIX, 'localStorage write ok', {
        key: DESIGNER_CLIPBOARD_KEY,
        length: value.length,
        value,
      })
    } catch (e) {
      console.log(LOG_PREFIX, 'localStorage write failed', e)
      // Storage can be unavailable; the system clipboard may still work.
    }
  }

  const getDesignerClipboard = () => {
    try {
      const value = localStorage.getItem(DESIGNER_CLIPBOARD_KEY)
      console.log(LOG_PREFIX, 'localStorage read', {
        key: DESIGNER_CLIPBOARD_KEY,
        length: value?.length ?? 0,
        value,
      })
      return value
    } catch (e) {
      console.log(LOG_PREFIX, 'localStorage read failed', e)
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
    console.log(LOG_PREFIX, 'copy clicked', {
      selected: describeComponent(store.design.selected),
    })
    if (browser && store.design.selected) {
      const value = JSON.stringify(store.design.selected)
      console.log(LOG_PREFIX, 'copy payload', {
        length: value.length,
        value,
      })
      setDesignerClipboard(value)
      try {
        await navigator.clipboard?.writeText(value)
        console.log(LOG_PREFIX, 'system clipboard write ok')
      } catch (e) {
        console.log(LOG_PREFIX, 'system clipboard write failed', e)
        // Browser clipboard writes can be denied; localStorage still supports same-origin tabs.
      }
    } else {
      console.log(LOG_PREFIX, 'copy skipped', {
        browser,
        selected: describeComponent(store.design.selected),
      })
    }
  }

  const paste = async () => {
    console.log(LOG_PREFIX, 'paste clicked', {
      selected: describeComponent(store.design.selected),
    })
    if (browser) {
      const values: { source: string; value: string | null | undefined }[] = []
      try {
        const value = await navigator.clipboard?.readText()
        console.log(LOG_PREFIX, 'system clipboard read ok', {
          length: value?.length ?? 0,
          value,
        })
        values.push({ source: 'system clipboard', value })
      } catch (e) {
        console.log(LOG_PREFIX, 'system clipboard read failed', e)
        // Fall back to the designer clipboard shared through localStorage.
      }
      values.push({ source: 'localStorage', value: getDesignerClipboard() })

      let data = null
      let source = null
      for (const { source: valueSource, value } of values) {
        if (!value) {
          console.log(LOG_PREFIX, 'paste source empty', { source: valueSource })
          continue
        }
        try {
          data = JSON.parse(value)
          source = valueSource
          console.log(LOG_PREFIX, 'paste source parsed', {
            source,
            parsed: describeComponent(data),
            raw: value,
          })
          break
        } catch (e) {
          console.log(LOG_PREFIX, 'paste source parse failed', {
            source: valueSource,
            value,
            error: e,
          })
          // Try the next clipboard source.
        }
      }
      if (!data) {
        console.log(LOG_PREFIX, 'paste failed: no valid payload')
        notification.error('error parsing paste')
        return
      }
      attachComponents(data)
      setColors(data)
      const target = store.design.selected ?? store.design
      console.log(LOG_PREFIX, 'paste payload after attach', {
        source,
        pasted: describeComponent(data),
        target: describePasteTarget(store.design.selected),
      })
      target.children.push(data)
      console.log(LOG_PREFIX, 'paste pushed to target', {
        target: describePasteTarget(store.design.selected),
      })
    } else {
      console.log(LOG_PREFIX, 'paste skipped', { browser })
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
