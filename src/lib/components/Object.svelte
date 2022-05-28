<script lang="ts">
  import { prepareStyle } from '$lib/utils'

  export let props = { title: '' }
  export let style = {}

  $: s = prepareStyle(style)
</script>

<object {...props} title={props.title} style={s}>
  <slot />
</object>
