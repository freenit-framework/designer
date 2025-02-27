<script lang="ts">
  import { Input } from '@freenit-framework/core'
  import store from '$lib/store'

  let selected = $derived(store.design.selected)
  let props: Record<any, any> | null = $state(null)
  let name: string = $state('')
  let value: string = $state('')

  let showAdd = (p: Record<any, any>) => () => {
    props = p
  }

  const removeProp = (props: Record<any, any>, key: string) => () => {
    delete props[key]
  }

  const createProp = (event: Event) => {
    event.preventDefault()
    if (props) {
      props[name] = value
    }
    props = null
  }
</script>

{#if selected}
  <div>
    props: &#123; <span
      role="button"
      tabindex="0"
      onclick={showAdd(selected.props)}
      onkeyup={showAdd(selected.props)}>+</span
    >
  </div>
  {#if props === selected.props}
    <form onsubmit={createProp}>
      <Input label="name" type="text" name="name" bind:value={name} autofocus />
      <Input label="value" type="text" name="value" bind:value />
      <div class="actions">
        <button type="submit" class="button primary outline">Create</button>
        <button class="button error" onclick={() => (props = null)}>Cancel</button>
      </div>
    </form>
  {:else}
    {#each Object.keys(selected.props) as key}
      <div class="prop">
        {`${key}: ${selected.props[key]}`}
        <span
          role="button"
          tabindex="0"
          onclick={removeProp(selected.props, key)}
          onkeyup={removeProp(selected.props, key)}>-</span
        >
      </div>
    {/each}
  {/if}
  <div>&#125;</div>
  <div>
    css: &#123; <span
      role="button"
      tabindex="0"
      onclick={showAdd(selected.css)}
      onkeyup={showAdd(selected.css)}>+</span
    >
  </div>
  {#if props === selected.css}
    <form onsubmit={createProp}>
      <Input label="name" type="text" name="name" bind:value={name} autofocus={true} />
      <Input label="value" type="text" name="value" bind:value />
      <div class="actions">
        <button type="submit" class="button primary outline">Create</button>
        <button class="button error" onclick={() => (props = null)}>Cancel</button>
      </div>
    </form>
  {:else}
    {#each Object.keys(selected.css) as key}
      <div class="prop">
        {`${key}: ${selected.css[key]}`}
        <span
          role="button"
          tabindex="0"
          onclick={removeProp(selected.css, key)}
          onkeyup={removeProp(selected.css, key)}>-</span
        >
      </div>
    {/each}
  {/if}
  <div>&#125;</div>
  <div>text: {`${selected.text}`}</div>
{/if}

<style>
  .prop {
    margin-left: 10px;
  }

  .actions {
    margin-top: 5px;
  }
</style>
