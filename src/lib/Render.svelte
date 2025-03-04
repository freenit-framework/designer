<script lang="ts">
  import store from '$lib/store'
  import type { Component } from '$lib/types'

  const allowDrop = (event: Event) => {
    event.preventDefault()
  }

  const drop = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const json = event.dataTransfer ? event.dataTransfer.getData('component') : ''
    const data: Component = JSON.parse(json)
    store.design.design.push(data)
  }
</script>

<div class="root" ondragover={allowDrop} ondrop={drop} role="none">
  {#each store.design.design as component}
    <div>{component.name}</div>
  {/each}
</div>

<style>
  .root {
    height: 100%;
    flex: 1;
  }
</style>
