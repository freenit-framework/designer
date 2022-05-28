<script lang="ts">
  import { prepareStyle } from '$lib/utils'

  export let style = {}

  $: s = prepareStyle(style)
</script>

<textarea style={s}>
  <slot />
</textarea>
