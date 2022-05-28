<script lang="ts">
  import { prepareStyle } from '$lib/utils'

  export let style = {}
  export let props = {}

  $: s = prepareStyle(style)
</script>

<col {...props} style={s} />
