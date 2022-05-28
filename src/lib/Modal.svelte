<script lang="ts">
  export let open = false
</script>

{#if open}
  <div class="modal_background">
    <div class="modal">
      <slot />
    </div>
  </div>
{/if}

<style>
  .modal_background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }

  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    filter: drop-shadow(0 0 20px #333);
    border-radius: 5px;
    padding: 10px;
  }
</style>
