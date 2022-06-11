<script lang="ts">
  import { slide } from 'svelte/transition'
  import { selected, over, parent as parentStore } from '$lib/store'
  import { dragStart, dragEnd, dragEnter, drop } from '$lib/utils/dnd'
  import type { Component, UndoItem } from '$lib/types'
  import { undo } from '$lib/store'
  import { mdiMenuDown, mdiMenuUp, mdiClose } from '@mdi/js'

  export let index: number
  export let data: Component = {
    id: '',
    component: '',
    name: '',
    text: '',
    children: [],
    props: {},
    style: {},
  }
  export let parent: Component = {
    id: '',
    component: '',
    name: '',
    text: '',
    children: [],
    props: {},
    style: {},
  }
  $: outline = $selected && $selected.id === data.id
  $: icon = data.open ? mdiMenuUp : mdiMenuDown

  function toggleOpen() {
    data.open = !data.open
  }

  function select() {
    $selected = data
    $parentStore = parent
  }

  function remove() {
    const item: UndoItem = {
      parent,
      attribute: 'children',
      value: parent.children,
    }
    $undo = [...$undo, item]
    parent.children = parent.children.filter((item) => item.id !== data.id)
  }
</script>

<div on:dragenter={dragEnter(data)}>
  <div
    on:drop={drop(parent, index)}
    class="drop"
    class:over={$over.id === data.id}
  />
  <div
    class="root"
    on:click|stopPropagation={select}
    class:outline
    transition:slide
    draggable={true}
    on:dragstart={dragStart(data, parent, index)}
    on:dragend={dragEnd}
    on:drop={drop(data)}
  >
    <div class="bar">
      <div class="titles">
        <div>{data.name.toLowerCase()}</div>
        <div class="subtitle">{data.id}</div>
      </div>
      <div class="action" on:click|stopPropagation={remove}>
        <svg class="icon">
          <path d={mdiClose} class="icon" />
        </svg>
      </div>
      <div class="action" on:click|stopPropagation={toggleOpen}>
        <svg class="icon">
          <path d={icon} class="icon" />
        </svg>
      </div>
    </div>
    <div class="content" class:hidden={!data.open}>
      {#each data.children as item, index (item.id)}
        <svelte:self bind:data={item} bind:parent={data} {index} />
      {/each}
    </div>
  </div>
</div>

<style>
  .root {
    margin-left: 10px;
    width: calc(100% - 10px);
    background-color: #8881;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
  }

  .bar {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-left: 10px;
  }

  .titles {
    flex: 1;
  }

  .subtitle {
    color: #777;
  }

  .action {
    margin-right: 10px;
  }

  .content {
    width: 100%;
    overflow: hidden;
  }

  .hidden {
    max-height: 0;
  }

  .outline {
    border-width: 1px;
    border-color: black;
    border-style: dotted;
  }

  .icon {
    width: 20px;
    height: 20px;
    fill: #888;
  }

  .drop {
    height: 1px;
  }

  .over {
    height: 30px;
  }
</style>
