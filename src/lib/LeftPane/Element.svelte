<script lang="ts">
  import { mdiClose, mdiMenuDown, mdiMenuUp } from '@mdi/js'
  import Element from './Element.svelte'
  import store from '$lib/store'
  import { allowDrop, drop, dragStart, dragEnd } from '$lib/dnd'
  import type { Component } from '$lib/types'

  let { element, parent, index } = $props()
  let selected = $derived(store.design.selected == element)
  let over = $state(false)
  let post = $state(false)

  const toggleOpen = (component: Component) => () => {
    component.open = !component.open
  }

  const remove = (parent: Component | null, component: Component) => () => {
    if (parent) {
      store.undo.action(parent, 'children', [...parent.children])
      parent.children = parent.children.filter((element) => element != component)
    } else {
      store.undo.action(store.design, 'design', [...store.design.children])
      store.design.children = store.design.children .filter((element: Component) => element != component)
    }
    store.design.selected = null
  }

  const select = (event: Event) => {
    event.stopPropagation()
    store.design.selected = element
  }

  const hover = () => {
    store.design.over = element
  }

  const blur = () => {
    store.design.over = null
  }

  const setover = (event: Event) => {
    over = true
    return allowDrop(event)
  }

  const setout = () => {
    over = false
  }

  const setdrop = () => {
    over = false
    dragEnd()
  }

  const setpost = (event: Event) => {
    post = true
    return allowDrop(event)
  }

  const setpostout = () => {
    post = false
  }

  const setpostdrop = () => {
    post = false
    dragEnd()
  }
</script>

<div ondragover={hover} ondragleave={blur} role="none">
  <div
    class="padding"
    class:active={store.design.over === element}
    class:over
    ondragover={setover}
    ondrop={drop(parent, index)}
    ondragend={setdrop}
    ondragleave={setout}
    role="none"
  ></div>
  <div
    class="drop"
    ondragover={allowDrop}
    ondrop={drop(element)}
    draggable="true"
    ondragstart={dragStart(element, parent ? parent.id : 'root')}
    ondragend={dragEnd}
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
          <path d={element.open ? mdiMenuDown : mdiMenuUp} />
        </svg>
      </div>
    </div>
    {#if element.open}
      {#each element.children as child, index}
        <Element element={child} parent={element} {index} />
      {/each}
    {/if}
  </div>
  <div
    class="padding"
    class:active={store.design.over === element}
    class:over={post}
    ondragover={setpost}
    ondrop={drop(parent, index + 1)}
    ondragend={setpostdrop}
    ondragleave={setpostout}
    role="none"
  ></div>
</div>

<style>
  .padding {
    height: 0px;
    min-height: 0px;
    transition: min-height 0.1s linear;
  }

  .active {
    min-height: 20px;
  }

  .over {
    background-color: #eee;
  }

  .drop {
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
