<script lang="ts">
  import { slide } from 'svelte/transition'
  import { selected, parent as parentStore } from '$lib/store'
  import { dragStart, dragEnd, drop } from '$lib/utils'
  import type { Component, UndoItem } from '$lib/types'
  import DnDWrapper from './DnDWrapper.svelte'
  import { undo } from '$lib/store'

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
  $: icon = data.open ? 'A' : 'v'

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

<DnDWrapper bind:data bind:parent {index}>
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
      <div class="action" on:click|stopPropagation={remove}>x</div>
      <div class="action" on:click|stopPropagation={toggleOpen}>{icon}</div>
    </div>
    <div class="content" class:hidden={!data.open}>
      {#each data.children as item, index (item.id)}
        <svelte:self bind:data={item} bind:parent={data} {index} />
      {/each}
    </div>
  </div>
</DnDWrapper>

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
</style>
