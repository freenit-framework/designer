<script lang="ts">
  import { selected } from '$lib/store'
  import { compile, decompile } from '$lib/utils/props'
  import type { Component } from '$lib/types'

  export let data: Component = {
    id: '',
    name: '',
    component: '',
    props: compile({}),
    style: compile({}),
    children: [],
    text: '',
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
  export let index = -1
  $: style = {
    ...decompile(data.style),
    cursor: 'grab',
    'user-select': 'none',
    'border-width': $selected.id === data.id ? '1px' : '0px',
    'border-color': 'black',
    'border-style': 'dotted',
  }
</script>

<svelte:component
  this={data.component}
  props={decompile(data.props)}
  bind:data
  bind:parent
  {index}
  {style}
>
  {data.text}
  {#each data.children as item, i (item.id)}
    <svelte:self bind:data={item} bind:parent={data} index={i} />
  {/each}
</svelte:component>
