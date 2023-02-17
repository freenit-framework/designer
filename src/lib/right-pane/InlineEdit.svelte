<script lang="ts">
  import { onMount } from 'svelte'
  import type { UndoItem } from '$lib/types'
  import { design, theme, undo } from '$lib/store'
  import { compile } from '$lib/utils/props'

  export let onClose: any
  export let data: Record<string, any> = {
    attribute: {
      value: '',
      type: 'string',
    },
  }
  export let name = 'attribute'
  let oldValue: any
  let oldType: any

  onMount(() => {
    oldValue = data[name].value
    oldType = data[name].type
  })

  function submit() {
    const item: UndoItem = {
      parent: data,
      attribute: name,
      value: {
        value: oldValue,
        type: oldType,
      },
    }
    const { value } = data[name]
    if (value === '{}') {
      data[name] = compile({})
    } else if (value === '[]') {
      data[name] = compile([])
    }
    $design = $design
    $theme = $theme
    $undo = [...$undo, item]
    onClose()
  }

  function cancel() {
    data[name].value = oldValue
    data[name].type = oldType
    onClose()
  }

  function edit(event: any) {
    data[name].value = event.target.value
    $design = $design
  }
</script>

<!-- svelte-ignore a11y-autofocus -->
<div class="root">
  <form on:submit|preventDefault={submit}>
    <label for="value" class="label">{name}:</label>
    <select name="type" bind:value={data[name].type}>
      <option value="string">String</option>
      <option value="number">Number</option>
      <option value="boolean">Boolean</option>
      <option value="color">Color</option>
    </select>
    <input
      required
      autofocus
      name="value"
      on:input={edit}
      value={data[name].value}
      type={data[name].type}
    />
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
