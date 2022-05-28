<script lang="ts">
  import { slide } from 'svelte/transition'
  import { over } from '$lib/store'
  import { dragEnter, drop } from '$lib/utils'
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

<div class="root" on:dragenter={dragEnter(data)} ondragover="return false">
  {#if $over.id === data.id}
    <div
      on:drop={drop(parent, index)}
      ondragover="return false"
      transition:slide
      class="drop"
    />
  {/if}
  <slot />
  {#if $over.id === data.id}
    <div
      on:drop={drop(parent, index + 1)}
      ondragover="return false"
      transition:slide
      class="drop"
    />
  {/if}
</div>

<style>
  .drop {
    height: 30px;
  }
</style>
