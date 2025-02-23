<script lang="ts">
  import store from '$lib/store'
  import Element from './Element.svelte'
</script>

<div class="tree">
  {#each store.design.design as element}
    <Element {element} />
  {/each}
</div>

<style>
  .tree {
    height: 50%;
    overflow: auto;
  }
</style>
