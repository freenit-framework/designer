<script lang="ts">
  import { prepareStyle } from '$lib/utils'

  export let style = {}
  export let props = {}
</script>

<wbr {...props} style={prepareStyle(style)} />
