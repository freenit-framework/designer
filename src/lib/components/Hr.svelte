<script lang="ts">
  import { prepareStyle } from '$lib/utils'

  export let style = {}
  export let props = {}
</script>

<hr {...props} style={prepareStyle(style)} />
