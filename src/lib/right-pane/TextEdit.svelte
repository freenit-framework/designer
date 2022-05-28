<script lang="ts">
  import { onMount } from 'svelte'
  import type { UndoItem } from '$lib/types'
  import { design, undo } from '$lib/store'

  export let onClose: any
  export let data: Record<string, any> = { text: '' }
  let oldValue: string

  onMount(() => {
    oldValue = data.text
  })

  function submit() {
    const item: UndoItem = {
      parent: data,
      attribute: 'text',
      value: oldValue,
    }
    $undo = [...$undo, item]
    onClose()
  }

  function cancel() {
    data.text = oldValue
    $design = $design
    onClose()
  }

  function handleInput(event: any) {
    data.text = event.target.value
    $design = $design
  }
</script>

<!-- svelte-ignore a11y-autofocus -->
<div class="root">
  <form on:submit|preventDefault={submit}>
    <label for="value" class="label">text:</label>
    <input autofocus name="value" value={data.text} on:input={handleInput} />
    <div class="buttons">
      <button class="button outline primary">OK</button>
      <button class="button outline secondary" on:click={cancel}>
        Cancel
      </button>
    </div>
  </form>
</div>

<style>
  .root {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .buttons {
    margin-top: 10px;
  }

  .label {
    margin-left: 10px;
  }
</style>
