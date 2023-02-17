<script context="module" lang="ts">
  export const prerender = false
</script>

<script lang="ts">
  import LeftPane from '$lib/left-pane'
  import RightPane from '$lib/right-pane'
  import Preview from '$lib/preview'
  import {
    undo,
    design,
    selected,
    initialComponent,
    parent,
    enableShortcuts,
  } from '$lib/store'
  import type { UndoItem } from '$lib/types'
  import { changeIds } from '$lib/utils'

  let input: any
  let output: any

  function handlePaste(event: any) {
    if (!Boolean($selected.id)) {
      return
    }
    const { value } = event.target
    if (value !== '') {
      const last = $selected.children.length
      const item: UndoItem = {
        parent: $selected,
        attribute: 'children',
        value: [...$selected.children],
      }
      $undo = [...$undo, item]
      const pasted = JSON.parse(value)
      const changedData = changeIds(pasted)
      $selected.children.push(changedData)
      $selected = $selected.children[last]
      $design = $design
    }
    input.blur()
  }

  function handleKeyDown(event: any) {
    if ($enableShortcuts) {
      const { key, ctrlKey } = event
      if (key === 'Delete') {
        if (Boolean($selected.id)) {
          const element = $parent.children
            .map((child) => child.id)
            .indexOf($selected.id)
          const item: UndoItem = {
            parent: $parent.children,
            attribute: element,
            value: $selected,
          }
          $parent.children.splice(element, 1)
          $undo = [...$undo, item]
          $selected = { ...initialComponent }
          $design = $design
        }
      } else if (ctrlKey && key === 'c') {
        output.value = JSON.stringify($selected)
        output.select()
        document.execCommand('copy')
        output.blur()
      } else if (ctrlKey && key === 'v') {
        input.focus()
        input.select()
        document.execCommand('paste')
      }
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
<textarea bind:this={input} on:input={handlePaste} class="paste" />
<textarea bind:this={output} on:input={handlePaste} class="paste" />

<section>
  <LeftPane />
  <Preview />
  <RightPane />
</section>

<style>
  section {
    display: flex;
    align-items: stretch;
    justify-content: center;
    height: 100vh;
  }

  .paste {
    position: absolute;
    z-index: -999;
    width: 0;
    opacity: 0;
  }
</style>
