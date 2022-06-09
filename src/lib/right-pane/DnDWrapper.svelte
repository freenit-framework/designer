<script lang="ts">
  import { slide } from 'svelte/transition'
  import { over } from '$lib/store'
  import { dragEnter, drop } from '$lib/utils/dnd'
  import type { Component } from '$lib/types'

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
</script>

<div class="root" on:dragenter={dragEnter(data)}>
  {#if $over.id === data.id}
    <div on:drop={drop(parent, index)} transition:slide class="drop" />
    <slot />
    <div on:drop={drop(parent, index + 1)} transition:slide class="drop" />
  {:else}
    <slot />
  {/if}
</div>

<style>
  .drop {
    height: 30px;
  }
</style>
