<script lang="ts">
  import { Input } from 'freenit'
  import PropEdit from './PropEdit.svelte'
  import type { Colord } from 'colord'
  import store from '$lib/store'

  const { design } = store
  let props: Record<any, any> | null = $state(null)
  let cssAddTarget: Record<any, any> | null = $state(null)
  let name: string = $state('')
  let value: string | number | boolean | Colord = $state('')
  let showEdit = $state(false)
  let oldText: string
  let propToEdit: string | null = $state(null)
  let oldProp: string | null = $state(null)
  let cssToEdit: string | null = $state(null)
  let oldCss: string | null = $state(null)
  let mediaQuery: string = $state('')
  let customQuery: string = $state('')
  let showCustom = $state(false)

  const queryLabel = (query: string): string => {
    if (query === '') return 'default'
    if (query === '@media (prefers-color-scheme: dark)') return 'dark mode'
    if (query === '@media (max-width: 767px)') return 'mobile'
    if (query === '@media (min-width: 768px) and (max-width: 1023px)') return 'tablet'
    if (query === '@media (min-width: 1024px)') return 'desktop'
    return query
  }

  const getCssTarget = () => {
    if (!mediaQuery || !design.selected) {
      return design.selected?.css
    }
    if (!design.selected.media) {
      design.selected.media = {}
    }
    if (!design.selected.media[mediaQuery]) {
      design.selected.media[mediaQuery] = {}
    }
    return design.selected.media[mediaQuery]
  }

  const getCssList = () => {
    if (!mediaQuery || !design.selected) {
      return design.selected?.css || {}
    }
    return design.selected.media?.[mediaQuery] || {}
  }

  const mediaOptions = $derived.by(() => {
    const options = [{ label: 'default', value: '' }]
    const existing = Object.keys(design.selected?.media || {})
    for (const q of existing) {
      options.push({ label: queryLabel(q), value: q })
    }
    const presets = [
      '@media (prefers-color-scheme: dark)',
      '@media (max-width: 767px)',
      '@media (min-width: 768px) and (max-width: 1023px)',
      '@media (min-width: 1024px)',
    ]
    for (const q of presets) {
      if (!existing.includes(q)) {
        options.push({ label: queryLabel(q), value: q })
      }
    }
    options.push({ label: 'custom...', value: 'custom' })
    return options
  })

  const onSelectMedia = (event: Event) => {
    const selected = (event.target as HTMLSelectElement).value
    cssAddTarget = null
    cssToEdit = null
    if (selected === 'custom') {
      showCustom = true
      mediaQuery = ''
    } else {
      showCustom = false
      mediaQuery = selected
    }
  }

  const applyCustomQuery = () => {
    if (customQuery.trim()) {
      mediaQuery = customQuery.trim()
      showCustom = false
      customQuery = ''
    }
  }

  const showAdd = (p: Record<any, any>) => () => {
    props = p
  }

  const showAddCss = () => {
    cssAddTarget = getCssTarget()
  }

  const removeProp = (target: Record<any, any>, key: string) => (event: Event) => {
    event.stopPropagation()
    store.undo.action(target, key, target[key])
    delete target[key]
  }

  const createProp = (event: Event) => {
    event.preventDefault()
    if (props) {
      store.undo.action(props, name, undefined)
      props[name] = value
      props = null
    } else if (cssAddTarget) {
      store.undo.action(cssAddTarget, name, undefined)
      cssAddTarget[name] = value
      cssAddTarget = null
    }
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
    const target = getCssTarget()
    if (target) {
      oldCss = target[prop]
    }
  }

  const editCss = (event: Event) => {
    event.preventDefault()
    const target = getCssTarget()
    if (target && cssToEdit) {
      store.undo.action(target, cssToEdit, oldCss)
    }
    cssToEdit = null
    oldCss = null
  }

  const cancelEditCss = () => {
    const target = getCssTarget()
    if (cssToEdit && target) {
      target[cssToEdit] = oldCss
    }
    cssToEdit = null
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

  <div class="media-row">
    <select value={mediaQuery} onchange={onSelectMedia}>
      {#each mediaOptions as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
    {#if showCustom}
      <form onsubmit={(e) => { e.preventDefault(); applyCustomQuery() }} class="custom-form">
        <Input label="query" type="text" name="customQuery" bind:value={customQuery} autofocus />
        <button type="submit" class="button primary outline">Add</button>
      </form>
    {/if}
  </div>

  <div>
    css: &#123;
    <span
      role="button"
      tabindex="0"
      onclick={showAddCss}
      onkeyup={showAddCss}
    >
      +
    </span>
  </div>
  {#if cssAddTarget}
    <form onsubmit={createProp}>
      <PropEdit bind:value bind:name css />
      <div class="actions">
        <button type="submit" class="button primary outline">Create</button>
        <button class="button error" onclick={() => (cssAddTarget = null)}>Cancel</button>
      </div>
    </form>
  {:else if cssToEdit}
    {@const target = getCssTarget()}
    <form onsubmit={editCss}>
      <PropEdit bind:value={target[cssToEdit]} noname css />
      <div class="actions">
        <button type="submit" class="button primary outline">OK</button>
        <button class="button error" onclick={cancelEditCss}>Cancel</button>
      </div>
    </form>
  {:else}
    {@const cssList = getCssList()}
    {#each Object.keys(cssList) as prop}
      <div class="prop" onclick={showEditCss(prop)} role="none">
        {#if cssList[prop].rgba}
          {`${prop}: ${cssList[prop].toHex()}`}
        {:else}
          {`${prop}: ${cssList[prop]}`}
        {/if}
        <span
          role="button"
          tabindex="0"
          onclick={removeProp(cssList, prop)}
          onkeyup={removeProp(cssList, prop)}
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

  .media-row {
    margin: 5px 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .custom-form {
    display: flex;
    align-items: flex-end;
    gap: 5px;
  }
</style>
