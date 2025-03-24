<script lang="ts">
  import './styles.css'
  import 'chota'
  import { SvelteToast } from '@zerodevx/svelte-toast'

  const options = {}
  let { children } = $props()
</script>

<svelte:head>
  <title>Freenit Designer</title>
  <meta name="Freenit Designer" content="Freenit Designer" />
</svelte:head>

<SvelteToast {options} />
<section class="root">
  {@render children?.()}
</section>

<style>
  .root {
    height: 100dvh;
    width: 100dvw;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
