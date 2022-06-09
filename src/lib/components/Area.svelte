<script lang="ts">
  import { prepareStyle } from '$lib/utils'

  export let style = {}
  export let props = { alt: '' }
</script>

<area {...props} alt={props.alt} style={prepareStyle(style)} />
