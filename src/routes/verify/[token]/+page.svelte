<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { store } from '@freenit-framework/svelte-base'

  onMount(async () => {
    const response = await store().auth.verify($page.params.token)
    if (response.ok) {
      goto('/login')
    }
  })
</script>
