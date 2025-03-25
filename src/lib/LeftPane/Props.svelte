<script lang="ts">
  import { Input } from '@freenit-framework/core'
  import PropEdit from './PropEdit.svelte'
  import type { Colord } from 'colord'
  import store from '$lib/store'

  const { design } = store
  let props: Record<any, any> | null = $state(null)
  let name: string = $state('')
  let value: string | number | boolean | Colord = $state('')
  let showEdit = $state(false)
  let oldText: string
  let propToEdit: string | null = $state(null)
  let oldProp: string | null = $state(null)
  let cssToEdit: string | null = $state(null)
  let oldCss: string | null = $state(null)

  const showAdd = (p: Record<any, any>) => () => {
    props = p
  }

  const removeProp = (props: Record<any, any>, key: string) => (event: Event) => {
    event.stopPropagation()
    store.undo.action(props, key, props[key])
    delete props[key]
  }

  const createProp = (event: Event) => {
    event.preventDefault()
    if (props) {
      store.undo.action(props, name, undefined)
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
    store.undo.action(store.design.selected, 'text', oldText)
    showEdit = false
    oldText = ''
  }

  const showEditProp = (prop: string) => () => {
    propToEdit = prop
    if (store.design.selected) {
      oldProp = store.design.selected.props[prop]
    }
  }

  const editProp = (event: Event) => {
    event.preventDefault()
    if (store.design.selected) {
      store.undo.action(store.design.selected.props, propToEdit, oldProp)
    }
    propToEdit = null
    oldProp = null
  }

  const cancelEditProp = () => {
    if (propToEdit && store.design.selected) {
      store.design.selected.props[propToEdit] = oldProp
    }
    oldProp = null
  }

  const showEditCss = (prop: string) => () => {
    cssToEdit = prop
    if (store.design.selected) {
      oldCss = store.design.selected.css[prop]
    }
  }

  const editCss = (event: Event) => {
    event.preventDefault()
    if (store.design.selected) {
      store.undo.action(store.design.selected.css, cssToEdit, oldCss)
    }
    cssToEdit = null
    oldCss = null
  }

  const cancelEditCss = () => {
    if (cssToEdit && store.design.selected) {
      store.design.selected.css[cssToEdit] = oldCss
    }
    oldCss = null
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
      <PropEdit bind:value bind:name />
      <div class="actions">
        <button type="submit" class="button primary outline">Create</button>
        <button class="button error" onclick={() => (props = null)}>Cancel</button>
      </div>
    </form>
  {:else if propToEdit}
    <form onsubmit={editProp}>
      <PropEdit bind:value={design.selected.props[propToEdit]} noname />
      <div class="actions">
        <button type="submit" class="button primary outline">OK</button>
        <button class="button error" onclick={cancelEditProp}>Cancel</button>
      </div>
    </form>
  {:else}
    {#each Object.keys(design.selected.props) as prop}
      <div class="prop" onclick={showEditProp(prop)} role="none">
        {#if design.selected.props[prop].rgba}
          {`${prop}: ${design.selected.props[prop].toHex()}`}
        {:else}
          {`${prop}: ${design.selected.props[prop]}`}
        {/if}
        <span
          role="button"
          tabindex="0"
          onclick={removeProp(design.selected.props, prop)}
          onkeyup={removeProp(design.selected.props, prop)}
        >
          -
        </span>
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
      <PropEdit bind:value bind:name />
      <div class="actions">
        <button type="submit" class="button primary outline">Create</button>
        <button class="button error" onclick={() => (props = null)}>Cancel</button>
      </div>
    </form>
  {:else if cssToEdit}
    <form onsubmit={editCss}>
      <PropEdit bind:value={design.selected.css[cssToEdit]} noname />
      <div class="actions">
        <button type="submit" class="button primary outline">OK</button>
        <button class="button error" onclick={cancelEditCss}>Cancel</button>
      </div>
    </form>
  {:else}
    {#each Object.keys(design.selected.css) as prop}
      <div class="prop" onclick={showEditCss(prop)} role="none">
        {#if design.selected.css[prop].rgba}
          {`${prop}: ${design.selected.css[prop].toHex()}`}
        {:else}
          {`${prop}: ${design.selected.css[prop]}`}
        {/if}
        <span
          role="button"
          tabindex="0"
          onclick={removeProp(design.selected.css, prop)}
          onkeyup={removeProp(design.selected.css, prop)}
        >
          -
        </span>
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
