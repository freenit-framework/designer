<script lang="ts">
  import { prepareStyle } from '$lib/utils'

  export let style = {}
  export let props = { alt: '' }

  $: s = prepareStyle(style)
</script>

<img {...props} style={s} alt={props.alt} />
