<script lang="ts">
  import store from '$lib/store'
  import * as components from '$lib/components'
  import { dragStart, dragEnd } from '$lib/dnd'
  import { makeid } from '$lib/utils'
  import type { Component } from '$lib/types.d'

  const htmlcomponents: Component[] = Object.keys(components).map((name) => ({
    name,
    id: makeid(),
    component: components[name],
    children: [],
    props: name === 'Option' ? { value: 'dummy' } : {},
    css: {},
    text: name === 'Option' ? 'dummy' : '',
  }))

  let c: Component[] = $state(htmlcomponents.filter(e => e.name.toLowerCase().includes(store.design.filter)))
  $effect(() => {
    c = htmlcomponents.filter(e => e.name.toLowerCase().includes(store.design.filter))
  })
</script>

<div class="root">
  {#each c as component}
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
