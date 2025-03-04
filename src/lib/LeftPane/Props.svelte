<script lang="ts">
  import { Input } from '@freenit-framework/core'
  import store from '$lib/store'

  const { design } = store
  let props: Record<any, any> | null = $state(null)
  let name: string = $state('')
  let value: string = $state('')
  let showEdit = $state(false)
  let oldText: string

  const showAdd = (p: Record<any, any>) => () => {
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

  const showEditText = () => {
    if (design.selected) {
      oldText = design.selected.text
    }
    showEdit = true
  }

  const cancelEditText = () => {
    if (design.selected) {
      design.selected.text = oldText
    }
    showEdit = false
  }

  const editText = (event: Event) => {
    event.preventDefault()
    showEdit = false
  }
</script>

{#if design.selected}
  <div>
    props: &#123;
    <span
      role="button"
      tabindex="0"
      onclick={showAdd(design.selected.props)}
      onkeyup={showAdd(design.selected.props)}
    >
      +
    </span>
  </div>
  {#if props === design.selected.props}
    <form onsubmit={createProp}>
      <Input label="name" type="text" name="name" bind:value={name} autofocus />
      <Input label="value" type="text" name="value" bind:value />
      <div class="actions">
        <button type="submit" class="button primary outline">Create</button>
        <button class="button error" onclick={() => (props = null)}>Cancel</button>
      </div>
    </form>
  {:else}
    {#each Object.keys(design.selected.props) as key}
      <div class="prop">
        {`${key}: ${design.selected.props[key]}`}
        <span
          role="button"
          tabindex="0"
          onclick={removeProp(design.selected.props, key)}
          onkeyup={removeProp(design.selected.props, key)}>-</span
        >
      </div>
    {/each}
  {/if}
  <div>&#125;</div>
  <div>
    css: &#123;
    <span
      role="button"
      tabindex="0"
      onclick={showAdd(design.selected.css)}
      onkeyup={showAdd(design.selected.css)}
    >
      +
    </span>
  </div>
  {#if props === design.selected.css}
    <form onsubmit={createProp}>
      <Input label="name" type="text" name="name" bind:value={name} autofocus />
      <Input label="value" type="text" name="value" bind:value />
      <div class="actions">
        <button type="submit" class="button primary outline">Create</button>
        <button class="button error" onclick={() => (props = null)}>Cancel</button>
      </div>
    </form>
  {:else}
    {#each Object.keys(design.selected.css) as key}
      <div class="prop">
        {`${key}: ${design.selected.css[key]}`}
        <span
          role="button"
          tabindex="0"
          onclick={removeProp(design.selected.css, key)}
          onkeyup={removeProp(design.selected.css, key)}>-</span
        >
      </div>
    {/each}
  {/if}
  <div>&#125;</div>
  {#if showEdit}
    <form onsubmit={editText}>
      <Input label="text" type="text" name="text" bind:value={design.selected.text} autofocus />
      <div class="actions">
        <button type="submit" class="button primary outline">Submit</button>
        <button class="button error" onclick={cancelEditText}>Cancel</button>
      </div>
    </form>
  {:else}
    <div onclick={showEditText} onkeyup={showEditText} role="none">
      text: {`${design.selected.text}`}
    </div>
  {/if}
{/if}

<style>
  .prop {
    margin-left: 10px;
  }

  .actions {
    margin-top: 5px;
  }
</style>
