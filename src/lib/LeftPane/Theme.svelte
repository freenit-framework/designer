<script lang="ts">
  import PropEdit from './PropEdit.svelte'
  import store from '$lib/store'
  import type { Colord } from 'colord'

  let prop: string | null = $state(null)
  let old: boolean | string | number | Colord | null = null

  const showEdit = (p: string) => () => {
    prop = p
    old = store.theme.detail[prop]
  }

  const editProp = (event: Event) => {
    event.preventDefault()
    prop = null
  }

  const cancel = () => {
    if (prop) {
      store.theme.detail[prop] = old
    }
    prop = null
  }
</script>

{#if prop}
  <form onsubmit={editProp}>
    <PropEdit bind:value={store.theme.detail[prop]} notype noname />
    <div class="actions">
      <button type="submit" class="button primary outline">OK</button>
      <button class="button error" onclick={cancel}>Cancel</button>
    </div>
  </form>
{:else}
  {#each Object.keys(store.theme.detail) as prop}
    <div onclick={showEdit(prop)} onkeyup={showEdit(prop)} role="none">
      {#if store.theme.detail[prop].rgba}
        {prop}: {store.theme.detail[prop].toHex()}
      {:else}
        {prop}: {store.theme.detail[prop]}
      {/if}
    </div>
  {/each}
{/if}
