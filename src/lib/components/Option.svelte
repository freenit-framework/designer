<script lang="ts">
  import { prepareStyle } from '$lib/utils'
  import { dragStart, dragEnd, drop } from '$lib/utils/dnd'
  import { compile } from '$lib/utils/props'
  import { selected, parent as storeParent } from '$lib/store'
  import type { Component } from '$lib/types'

  export let props = { value: "dummy" }
  export let style = {}
  export let data: Component = {
    id: '',
    name: '',
    component: '',
    props: compile(props),
    style: compile({}),
    children: [],
    text: props.value,
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

  function select() {
    $selected = data
    $storeParent = parent
  }
</script>

<option
  {...props}
  style={prepareStyle(style)}
  draggable={true}
  on:dragstart={dragStart(data, parent, index)}
  on:dragend={dragEnd}
  on:drop={drop(data)}
  on:click|stopPropagation={select}
  on:keypress={select}
  value={props.value}
>
  <slot />
</option>
