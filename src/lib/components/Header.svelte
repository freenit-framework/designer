<script lang="ts">
  import { prepareStyle } from '$lib/utils'

  export let props = {}
  export let style = {}

  $: s = prepareStyle(style)
</script>

<header {...props} style={s}>
  <slot />
</header>
