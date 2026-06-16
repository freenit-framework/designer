<script lang="ts">
  import { User } from 'freenit'
  import store from '$lib/store'

  const { data: props } = $props()
</script>

<User pk={props.pk} store={store} />
