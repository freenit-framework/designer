<script lang="ts">
  import { design } from '$lib/store'
  import { drop } from '$lib/utils'
  import Component from './Component.svelte'
</script>

<section class="root" on:drop={drop($design)} ondragover="return false">
  {#each $design.children as item, index (item.id)}
    <Component bind:data={item} bind:parent={$design} {index} />
  {/each}
</section>

<style>
  .root {
    flex: 1;
    overflow: auto;
    width: 100%;
    height: 100%;
  }
</style>
