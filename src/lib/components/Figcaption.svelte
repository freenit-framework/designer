<script lang="ts">
  import { prepareStyle } from '$lib/utils'

  export let props = {}
  export let style = {}

  $: s = prepareStyle(style)
</script>

<!-- svelte-ignore a11y-structure -->
<figcaption {...props} style={s}>
  <slot />
</figcaption>
