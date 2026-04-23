<script lang="ts">
  import store from '$lib/store'
  import Element from './Element.svelte'
  import { allowDrop, drop } from '$lib/dnd'
</script>

<div class="tree" ondragover={allowDrop} ondrop={drop(store.design)} role="none">
  {#each store.design.children as element, index}
    <Element {element} parent={store.design} {index} />
  {/each}
</div>

<style>
  .tree {
    height: 50%;
    overflow: auto;
  }
</style>
