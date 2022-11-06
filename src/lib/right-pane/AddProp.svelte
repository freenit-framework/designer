<script lang="ts">
import { Base64 } from 'js-base64'
  import { design, undo } from '$lib/store'
  import { compile } from '$lib/utils/props'
  import Modal from '$lib/Modal.svelte'
  import type { UndoItem } from '$lib/types'

  let name: string = ''
  let value: any = ''
  let type: string = 'string'
  let pre: string = 'url('
  let post: string = ')'
  let fileInput: any
  export let open = false
  export let data = compile({})

  function openFile() {
    fileInput.click()
  }

  function load(event: any) {
    if (event.target.files.length > 0) {
      const [file] = event.target.files
      const reader = new FileReader()
      reader.onload = (e) => {
        value = `${pre}${e.target?.result}${post}`
      }
      reader.readAsDataURL(file)
    }
  }

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
      const compiled = compile(value)
      data.value[name] = compiled
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
      <option value="file">File</option>
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
    {:else if type === 'file'}
      <div class="file">
        <input name="value" type="file" class="hidden" bind:value required bind:this={fileInput} on:change={load} />
        <div>
          <label for="pre">Pre</label>
          <input name="pre" bind:value={pre} />
          <label for="post">Post</label>
          <input name="post" bind:value={post} />
        </div>
        <button class="button primary" on:click={openFile}>Browse</button>
      </div>
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

  .hidden {
    display: none !important;
  }
</style>
