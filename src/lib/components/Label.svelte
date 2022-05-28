<script lang="ts">
  import { prepareStyle } from '$lib/utils'

  export let props = {}
  export let style = {}

  $: s = prepareStyle(style)
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label {...props} style={s}>
  <slot />
</label>
