<script lang="ts">
  import { prepareStyle } from '$lib/utils'

  export let props = { href: '' }
  export let style = {}

  $: s = prepareStyle(style)
</script>

<a {...props} href={props.href} style={s}>
  <slot />
</a>
