<script lang="ts">
  import { prepareStyle } from '$lib/utils'

  export let props = {}
  export let style = {}

  $: s = prepareStyle(style)
</script>

<rp {...props} style={s}>
  <slot />
</rp>
