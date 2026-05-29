<script lang="ts">
  // @ts-nocheck
  import PropEdit from './PropEdit.svelte'
  import store from '$lib/store'
  import type { Colord } from 'colord'

  let prop: string | null = $state(null)
  let old: boolean | string | number | Colord | null = null

  const currentTheme = $derived.by(() =>
    store.theme.mode === 'light' ? store.theme.light : store.theme.dark,
  )

  const showEdit = (p: string) => () => {
    prop = p
    old = currentTheme[p]
  }

  const editProp = (event: Event) => {
    event.preventDefault()
    const target = store.theme.mode === 'light' ? store.theme.light : store.theme.dark
    store.undo.action(target, prop, old)
    store.theme.apply()
    prop = null
  }

  const cancel = () => {
    if (prop) {
      const target = store.theme.mode === 'light' ? store.theme.light : store.theme.dark
      target[prop] = old
      store.theme.apply()
    }
    prop = null
  }
</script>

{#if prop}
  <form onsubmit={editProp}>
    {#if store.theme.mode === 'light'}
      <PropEdit bind:value={store.theme.light[prop]} notype noname />
    {:else}
      <PropEdit bind:value={store.theme.dark[prop]} notype noname />
    {/if}
    <div class="actions">
      <button type="submit" class="button primary outline">OK</button>
      <button class="button error" onclick={cancel}>Cancel</button>
    </div>
  </form>
{:else}
  <div class="mode-toggle">
    <button
      class="button outline"
      class:primary={store.theme.mode === 'light'}
      onclick={() => (store.theme.mode = 'light')}
    >
      Light
    </button>
    <button
      class="button outline"
      class:primary={store.theme.mode === 'dark'}
      onclick={() => (store.theme.mode = 'dark')}
    >
      Dark
    </button>
  </div>
  {#each Object.keys(currentTheme) as prop}
    <div onclick={showEdit(prop)} onkeyup={showEdit(prop)} role="none">
      {#if currentTheme[prop].rgba}
        {prop}: {currentTheme[prop].toHex()}
      {:else}
        {prop}: {currentTheme[prop]}
      {/if}
    </div>
  {/each}
{/if}

<style>
  .mode-toggle {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
    justify-content: center;
  }
</style>
