<script lang="ts">
  import { prepareStyle } from '$lib/utils'
  import { selected } from '$lib/store'
  import { compile } from '$lib/utils/props'
  import type { Component } from '$lib/types'

  export let style = {}
  export let props = { alt: '' }
  export let data: Component = {
    id: '',
    name: '',
    component: '',
    props: compile({}),
    style: compile({}),
    children: [],
    text: '',
  }

  function select() {
    $selected = data
  }
</script>

<area
  {...props}
  alt={props.alt}
  style={prepareStyle(style)}
  on:click|stopPropagation={select}
/>
