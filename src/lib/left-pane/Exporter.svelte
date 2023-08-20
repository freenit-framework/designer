<script lang="ts">
  import Modal from '$lib/Modal.svelte'
  import { framework } from '$lib/store'
  import { exporter } from '$lib/utils/exporter'

  export let open = false
  let exportData: string | null = exporter($framework)
  $: exportType = $framework === 'svelte' ? 'page.svelte' : 'page.tsx'

  function changeFramework(event: any) {
    $framework = event.target.value
  }

  function cancel() {
    open = false
  }

  function calculate() {
    exportData = null
    exportData = exporter($framework)
  }
</script>

{#if open}
  <div class="root">
    <div class="choice">
      <div>
        <input
          checked={$framework === 'svelte'}
          name="svelte"
          type="radio"
          value="svelte"
          on:change={changeFramework}
        />
        <label for="svelte">Svelte</label>
      </div>
      <div>
        <input
          checked={$framework === 'react'}
          name="react"
          type="radio"
          value="react"
          on:change={changeFramework}
        />
        <label for="react">React</label>
      </div>
      <div>
        <input
          checked={$framework === 'react functional'}
          name="react functional"
          type="radio"
          value="react functional"
          on:change={changeFramework}
        />
        <label for="react functional">React (functional)</label>
      </div>
    </div>
    <div class="buttons">
      {#if exportData === null}
        <button disabled class="button outline primary">Export</button>
      {:else}
        <a
          href={exportData}
          download={exportType}
          on:click={cancel}
          on:mouseover={calculate}
          on:focus={calculate}
          class="button outline primary"
        >
          Export
        </a>
      {/if}
      <button class="button outline" on:click={cancel}>Cancel</button>
    </div>
  </div>
{/if}

<style>
  .root {
    width: 100%;
    padding: 10px;
    background-color: white;
  }

  .choice {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
</style>
