<script lang="ts">
  import Element from './Element.svelte'
  import store from '$lib/store'
  import { allowDrop, drop } from '$lib/dnd'
</script>

<div class="padding">
  <div
    class="root"
    class:mobile={store.design.device === 'mobile'}
    class:tablet={store.design.device === 'tablet'}
    ondragover={allowDrop}
    ondrop={drop(null)}
    role="none"
  >
    {#each store.design.children as component}
      <Element {component} />
    {/each}
  </div>
</div>

<style>
  .padding {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: gray;
  }

  .root {
    height: 100%;
    width: 100%;
    background-color: white;
    overflow: auto;
  }

  .mobile {
    max-width: 375px;
    max-height: 667px;
  }

  .tablet {
    max-width: 960px;
    max-height: 600px;
  }
</style>
