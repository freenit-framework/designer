<script lang="ts">
  import { prepareStyle } from '$lib/utils'

  export let style = {}

  $: s = prepareStyle(style)
</script>

<br style={s} />
