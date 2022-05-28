<script lang="ts">
  import { prepareStyle } from '$lib/utils'

  export let props = {}
  export let style = {}

  $: s = prepareStyle(style)
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video {...props} style={s}>
  <slot />
</video>
