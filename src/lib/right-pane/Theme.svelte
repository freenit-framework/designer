<!-- svelte-ignore a11y-autofocus -->
<script lang="ts">
  import { theme } from '$lib/store'
  import { setThemeProp } from '$lib/utils'
  import InlineEdit from './InlineEdit.svelte'

  let editing: string | null = null

  function edit(prop: string) {
    function handler() {
      editing = prop
    }
    return handler
  }

  function change() {
    if (editing) {
      setThemeProp(editing, $theme.value[editing].value)
    }
    editing = null
  }
</script>

<div class="root">
  {#each Object.keys($theme.value) as prop}
    {#if editing === prop}
      <InlineEdit bind:data={$theme.value} name={prop} onClose={change} />
    {:else}
      <div on:click={edit(prop)} on:keypress={edit(prop)}>
        {prop}: {$theme.value[prop].value}
      </div>
    {/if}
  {/each}
</div>

<style>
  .root {
    flex: 1;
    padding: 10px;
    overflow: auto;
  }
</style>
