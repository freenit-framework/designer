<script lang="ts">
  import LeftPane from '$lib/LeftPane'
  import Render from '$lib/Render.svelte'
</script>

<div class="root">
  <LeftPane />
  <Render />
</div>

<style>
  .root {
    height: 100dvh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
