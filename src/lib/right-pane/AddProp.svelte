<script lang="ts">
  import { design, undo } from '$lib/store'
  import { compile } from '$lib/utils/props'
  import Modal from '$lib/Modal.svelte'
  import type { UndoItem } from '$lib/types'

  let name: string = ''
  let value: any = ''
  let type: string = 'string'
  export let open = false
  export let data = compile({})

  function addProp() {
    if (name === 'style') {
      return
    }
    if (value === '{}') {
      const item: UndoItem = {
        parent: data,
        attribute: name,
        value: data[name],
      }
      $undo = [...$undo, item]
      data.value = {
        ...data.value,
        [name]: compile({}),
      }
    } else if (value === '[]') {
      const item: UndoItem = {
        parent: data,
        attribute: name,
        value: data[name],
      }
      $undo = [...$undo, item]
      data.value = {
        ...data.value,
        [name]: compile([]),
      }
    } else {
      const item: UndoItem = {
        parent: data.value,
        attribute: name,
        value: data.value[name],
      }
      data.value[name] = compile(value)
      data.value[name].type = type
      $undo = [...$undo, item]
    }
    open = false
    $design = $design
  }

  function close() {
    open = false
  }
</script>

<!-- svelte-ignore a11y-autofocus -->
<Modal {open}>
  <form on:submit|preventDefault={addProp}>
    <label for="type">Type</label>
    <select name="type" bind:value={type}>
      <option value="string">String</option>
      <option value="number">Number</option>
      <option value="boolean">Boolean</option>
      <option value="color">Color</option>
    </select>
    <label for="name">Name</label>
    <input name="name" bind:value={name} autofocus required />
    <label for="value">Value</label>
    {#if type === 'string'}
      <input name="value" bind:value required />
    {:else if type === 'number'}
      <input name="value" type="number" bind:value required />
    {:else if type === 'boolean'}
      <input name="value" type="checkbox" bind:value required />
    {:else if type === 'color'}
      <input name="value" type="color" bind:value required />
    {/if}
    <div class="buttons">
      <button type="submit" class="button outline primary">OK</button>
      <button class="button outline secondary" on:click={close}>
        Cancel
      </button>
    </div>
  </form>
</Modal>

<style>
  .buttons {
    margin-top: 10px;
  }
</style>
