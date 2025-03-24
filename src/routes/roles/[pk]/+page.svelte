<script lang="ts">
  import { Role } from '@freenit-framework/core'
  import store from '$lib/store'

  const { data: props } = $props()
</script>

<Role pk={props.pk} store={store} />
