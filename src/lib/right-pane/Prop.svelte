<script lang="ts">
  import AddProp from './AddProp.svelte'
  import InlineEdit from './InlineEdit.svelte'
  import { isSimple, isObject } from '$lib/utils/props'
  import { undo } from '$lib/store'
  import type { UndoItem } from '$lib/types'

  export let data = { name: '' }
  export let name: string | number = ''
  let hover = false
  let add = false
  let removeHover = false
  let editing = false

  function setHover() {
    hover = true
  }

  function unsetHover() {
    hover = false
  }

  function openAdd() {
    add = true
  }

  function remove() {
    const item: UndoItem = {
      parent: data,
      attribute: name,
      value: data[name],
    }
    $undo = [...$undo, item]
    if (Array.isArray(data)) {
      data.splice(Number(name), 1)
    } else {
      delete data[name]
    }
    data = data
  }

  function hoverRemove() {
    removeHover = true
  }

  function leaveRemove() {
    removeHover = false
  }

  function edit() {
    editing = true
  }

  function closeEdit() {
    editing = false
  }
</script>

{#if Boolean(name) && data[name] !== undefined}
  <div class="root">
    {#if editing}
      <InlineEdit bind:data bind:name onClose={closeEdit} />
    {:else if data[name].type === 'file'}
      <span
        on:mouseover={hoverRemove}
        on:focus={hoverRemove}
        on:mouseleave={leaveRemove}
        on:blur={leaveRemove}
        on:click={edit}
      >
        {name}: &lt;file&gt;
      </span>
    {:else if isSimple(data[name])}
      <span
        on:mouseover={hoverRemove}
        on:focus={hoverRemove}
        on:mouseleave={leaveRemove}
        on:blur={leaveRemove}
        on:click={edit}
      >
        {#if Array.isArray(data)}
          {data[name].value}
        {:else}
          {name}: {data[name].value}
        {/if}
        <span class="tool" class:hover={removeHover} on:click={remove}>-</span>
      </span>
    {:else if isObject(data[name])}
      <span
        on:mouseover={setHover}
        on:focus={setHover}
        on:mouseleave={unsetHover}
        on:blur={unsetHover}
      >
        {name}: &#123;
        <span class="tool" class:hover on:click={openAdd}>+</span>
        <span class="tool" class:hover on:click={remove}>-</span>
      </span>
      {#each Object.keys(data[name].value) as propname}
        <svelte:self bind:data={data[name].value} name={propname} />
      {/each}
      <div>&#125;</div>
    {:else if Array.isArray(data[name].value)}
      <span
        on:mouseover={setHover}
        on:focus={setHover}
        on:mouseleave={unsetHover}
        on:blur={unsetHover}
      >
        {name}: [
        <span class="tool" class:hover on:click={openAdd}>+</span>
        <span class="tool" class:hover on:click={remove}>-</span>
      </span>
      {#each data[name].value as _value, index}
        <svelte:self bind:data={data[name].value} name={index} />
      {/each}
      <div>]</div>
    {/if}
  </div>
{/if}

<AddProp bind:open={add} bind:data />

<style>
  .root {
    margin-left: 10px;
  }

  .tool {
    color: #0000;
  }

  .hover {
    color: black;
  }
</style>
