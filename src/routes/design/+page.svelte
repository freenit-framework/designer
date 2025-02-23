<script lang="ts">
  import LeftPane from '$lib/LeftPane'
</script>

<div class="root">
  <LeftPane />
  <div class="render">
  </div>
</div>

<style>
  .root {
    height: 100dvh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .render {
    height: 100%;
    flex: 1;
  }
</style>
