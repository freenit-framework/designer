<script lang="ts">
  import DnD from './DnD.svelte'
  import { device } from '$lib/store'
</script>

<div class="preview">
  {#if $device === 'desktop'}
    <DnD />
  {:else}
    <div class="padding">
      <div class={$device}>
        <DnD />
      </div>
    </div>
  {/if}
</div>

<style>
  .preview {
    flex: 1;
    overflow: auto;
  }

  .tablet {
    width: 960px;
    height: 600px;
    background-color: white;
    overflow: auto;
  }

  .mobile {
    width: 375px;
    height: 667px;
    background-color: white;
    overflow: auto;
  }

  .padding {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
