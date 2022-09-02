<script lang="ts">
  import 'chota'
  import '../app.css'
  import { onMount } from 'svelte'
  import { theme } from '$lib/store'
  import { setThemeProp } from '$lib/utils'

  onMount(() => {
    for (const item of Object.keys($theme)) {
      setThemeProp(item, $theme[item])
    }
  })
</script>

<svelte:head>
  <title>Freenit Designer</title>
</svelte:head>

<main>
  <slot />
</main>

<style>
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
