<script lang="ts">
  import Element from './Element.svelte'
  import store from '$lib/store'
  import { allowDrop, drop } from '$lib/dnd'
</script>

<div class="root" ondragover={allowDrop} ondrop={drop(null)} role="none">
  {#each store.design.children as component}
    <Element {component} />
  {/each}
</div>

<style>
  .root {
    height: 100%;
    flex: 1;
  }
</style>
