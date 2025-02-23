<script lang="ts">
  import { mdiClose, mdiMenuUp } from '@mdi/js'
  import store from '$lib/store'
  import type { Component } from '$lib/types'

  const allowDrop = (event: Event) => {
    event.preventDefault()
  }

  const drop = (component: Component) => (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const json = event.dataTransfer ? event.dataTransfer.getData('component') : '{}'
    const data: Component = JSON.parse(json)
    component.children.push(data)
    console.log(component)
  }
</script>

<div class="tree">
  {#each store.design.design as element}
    <div class="element" ondragover={allowDrop} ondrop={drop(element)} role="none">
      <div class="data">
        <div>{element.name}</div>
        <div class="id">{element.id}</div>
      </div>
      <div>
        <svg class="icon">
          <path d={mdiClose} />
        </svg>
      </div>
      <div>
        <svg class="icon">
          <path d={mdiMenuUp} />
        </svg>
      </div>
    </div>
  {/each}
</div>

<style>
  .tree {
    height: 50%;
    overflow: auto;
  }

  .element {
    border-radius: 5px;
    border: 1px solid #ddd;
    background-color: rgba(128, 128, 128, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 5px;
    margin-top: 2px;
  }

  .data {
    flex: 1;
    padding: 5px;
  }

  .id {
    color: #888;
  }

  .icon {
    width: 26px;
    height: 26px;
    fill: #666;
  }
</style>
