<script lang="ts">
  import { onMount } from 'svelte'
  import LeftPane from '$lib/LeftPane'
  import Render from '$lib/Render'
  import { removeSelected } from '$lib/utils'

  const isEditableTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) {
      return false
    }

    return (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable ||
      target.closest('[contenteditable="true"]') !== null
    )
  }

  onMount(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Delete' || isEditableTarget(event.target)) {
        return
      }

      event.preventDefault()
      removeSelected()
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  })
</script>

<div class="root">
  <LeftPane />
  <Render />
</div>

<style>
  .root {
    height: 100dvh;
    width: 100%;
    display: flex;
  }
</style>
