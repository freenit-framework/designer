<script lang="ts">
  import components from '$lib/components'
</script>

<div class="root">
  {#each components as component}
    <div class="component">{component.name.toLowerCase()}</div>
  {/each}
</div>

<style>
  .root {
    width: 50%;
    padding: 5px;
    border-right: 1px solid #eee;
    overflow: auto;
  }

  .component {
    padding: 5px;
    border-radius: 5px;
    background-color: rgba(128, 128, 128, 0.1);
    margin-bottom: 5px;
  }
</style>
