<script lang="ts">
  import store from '$lib/store'
  import Element from './Element.svelte'
</script>

<div class="tree">
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
