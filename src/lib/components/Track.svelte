<script lang="ts">
  import { prepareStyle } from '$lib/utils'
  import { selected, parent as storeParent } from '$lib/store'
  import { compile } from '$lib/utils/props'
  import type { Component } from '$lib/types'

  export let style = {}
  export let props = {}
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
    $storeParent = parent
  }
</script>

<track
  {...props}
  style={prepareStyle(style)}
  on:click|stopPropagation={select}
/>
