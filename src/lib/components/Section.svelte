<script lang="ts">
  import { prepareStyle } from '$lib/utils'
  import { dragStart, dragEnd, drop } from '$lib/utils/dnd'
  import { compile } from '$lib/utils/props'
  import type { Component } from '$lib/types'

  export let props = {}
  export let style = {}
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
</script>

<section
  {...props}
  style={prepareStyle(style)}
  draggable={true}
  on:dragstart={dragStart(data, parent, index)}
  on:dragend={dragEnd}
  on:drop={drop(data)}
>
  <slot />
</section>
