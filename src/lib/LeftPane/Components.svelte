<script lang="ts">
  import components from '$lib/components'
  import type { Component } from '$lib/types.d'

  const dragStart = (component: Component) => (event: DragEvent) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('component', JSON.stringify(component))
    }
  }

  const dragEnd = () => {}
</script>

<div class="root">
  {#each components as component}
    <div
      class="component"
      draggable="true"
      ondragstart={dragStart(component)}
      ondragend={dragEnd}
      role="none"
    >
      {component.name.toLowerCase()}
    </div>
  {/each}
</div>

<style>
  .root {
    width: 50%;
    padding: 5px;
    border-right: 1px solid #eee;
    overflow: auto;
  }

  .component {
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ddd;
    background-color: rgba(128, 128, 128, 0.1);
    margin-bottom: 5px;
  }
</style>
