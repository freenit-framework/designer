<script lang="ts">
  import { design } from '$lib/store'
  import { dragEnter, dragEnd, drop } from '$lib/utils/dnd'
  import TreeItem from './TreeItem.svelte'
</script>

<div
  class="root"
  on:dragenter={dragEnter($design)}
  on:dragend={dragEnd}
  on:drop={drop($design)}
  ondragover="return false"
>
  {#each $design.children as item, index (item.id)}
    <TreeItem bind:data={item} bind:parent={$design} {index} />
  {/each}
</div>

<style>
  .root {
    height: 50%;
    width: 100%;
    margin: 10px;
    overflow: auto;
    padding-right: 10px;
  }
</style>
