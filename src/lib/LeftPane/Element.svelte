<script lang="ts">
  import { mdiClose, mdiMenuUp } from '@mdi/js'
  import Element from './Element.svelte'
  import store from '$lib/store'
  import type { Component } from '$lib/types'

  let { element, parent } = $props()
  let selected = $derived(store.design.selected == element)

  const allowDrop = (event: Event) => {
    event.preventDefault()
  }

  const drop = (component: Component) => (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const json = event.dataTransfer ? event.dataTransfer.getData('component') : '{}'
    const data: Component = JSON.parse(json)
    component.children.push(data)
  }

  const toggleOpen = (component: Component) => () => {
    component.open = !component.open
  }

  const remove = (parent: Component | null, component: Component) => () => {
    if (parent) {
      parent.children = parent.children.filter((element) => element != component)
    } else {
      store.design.design = store.design.design.filter((element: Component) => element != component)
    }
  }

  const select = () => {
    store.design.selected = element
  }
</script>

<div
  class="root"
  ondragover={allowDrop}
  ondrop={drop(element)}
  onclick={select}
  role="none"
  class:selected
>
  <div class="element">
    <div class="data">
      <div>{element.name}</div>
      <div class="id">{element.id}</div>
    </div>
    <div>
      <svg class="icon" onclick={remove(parent, element)} role="none">
        <path d={mdiClose} />
      </svg>
    </div>
    <div>
      <svg class="icon" onclick={toggleOpen(element)} role="none">
        <path d={mdiMenuUp} />
      </svg>
    </div>
  </div>
  {#if element.open}
    {#each element.children as child}
      <Element element={child} parent={element} />
    {/each}
  {/if}
</div>

<style>
  .root {
    border-radius: 5px;
    border: 1px solid #ddd;
    background-color: rgba(128, 128, 128, 0.1);
    padding-left: 5px;
    margin-top: 2px;
  }

  .selected {
    border: 1px dotted #000;
  }

  .element {
    display: flex;
    justify-content: center;
    align-items: center;
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
