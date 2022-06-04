<script lang="ts">
  import { prepareStyle, dragStart, dragEnd, drop } from '$lib/utils'
  import { compile } from '$lib/utils/props'
  import type { Component } from '$lib/types'

  export let props = { title: '' }
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

<object
  {...props}
  title={props.title}
  style={prepareStyle(style)}
  draggable={true}
  on:dragstart={dragStart(data, parent, index)}
  on:dragend={dragEnd}
  on:drop={drop(data)}
>
  <slot />
</object>
