<script lang="ts">
  import { prepareStyle } from '$lib/utils'

  export let props = { title: '' }
  export let style = {}

  $: s = prepareStyle(style)
</script>

<iframe {...props} title={props.title} style={s}>
  <slot />
</iframe>
