<script lang="ts">
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import store from '$lib/store'

  const { data: props } = $props()

  onMount(async () => {
    const response = await store.auth.verify(props.token)
    if (response.ok) {
      goto('/login')
    }
  })
</script>
