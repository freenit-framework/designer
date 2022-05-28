<script lang="ts">
  import Modal from '$lib/Modal.svelte'
  import { framework } from '$lib/store'
  import { exporter } from '$lib/utils/exporter'

  export let open = false
  let exportData: string | null = exporter($framework)
  $: exportType = $framework === 'svelte' ? 'page.svelte' : 'page.tsx'

  function changeFramework(event: any) {
    $framework = event.target.value
    exportData = exporter($framework)
  }

  function cancel() {
    open = false
  }
</script>

<Modal {open}>
  <div class="choice">
    <div>
      <input
        checked={$framework === 'svelte'}
        name="framework"
        type="radio"
        value="svelte"
        on:change={changeFramework}
      />
      <label for="svelte">Svelte</label>
    </div>
    <div>
      <input
        checked={$framework === 'react'}
        name="framework"
        type="radio"
        value="react"
        on:change={changeFramework}
      />
      <label for="react">React</label>
    </div>
    <div>
      <input
        checked={$framework === 'react functional'}
        name="framework"
        type="radio"
        value="react functional"
        on:change={changeFramework}
      />
      <label for="react functional">React (functional)</label>
    </div>
  </div>
  <a
    href={exportData}
    class="button outline primary"
    download={exportType}
    on:click={cancel}
  >
    Export
  </a>
  <button class="button outline" on:click={cancel}>Cancel</button>
</Modal>

<style>
  .choice {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
</style>
