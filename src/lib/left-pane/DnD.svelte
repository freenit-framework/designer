<script lang="ts">
  import htmlnames from '$lib/components'
  import { dragStart, dragEnd } from '$lib/utils/dnd'

  let search = ''

  $: items = htmlnames.filter((item) =>
    item.name.toLowerCase().includes(search),
  )
</script>

<div class="search">
  <input bind:value={search} />
</div>

<div class="root">
  {#each items as item (item.id)}
    <div
      class="element"
      draggable={true}
      on:dragstart={dragStart(item)}
      on:dragend={dragEnd}
    >
      {item.name.toLowerCase()}
    </div>
  {/each}
</div>

<style>
  .root {
    flex: 1;
    overflow: auto;
    width: 100%;
  }

  .element {
    border-style: dotted;
    border-width: 1px;
    margin: 3px;
    padding: 3px;
  }

  .search {
    padding: 10px;
    width: 100%;
  }
</style>
