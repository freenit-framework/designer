<script context="module" lang="ts">
  export const prerender = true
</script>

<script lang="ts">
</script>

<svelte:head>
  <title>Freenit Designer for Svelte</title>
</svelte:head>

<section>
  <h1>Freenit Designer for Svelte</h1>
  <a href="/design">
    <button>Design!</button>
  </a>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  h1 {
    width: 100%;
    text-align: center;
  }

  button {
    height: 80px;
    width: 150px;
  }
</style>
