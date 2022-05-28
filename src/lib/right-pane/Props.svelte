<script lang="ts">
  import { selected } from '$lib/store'
  import AddProp from './AddProp.svelte'
  import TextEdit from './TextEdit.svelte'
  import Prop from './Prop.svelte'

  let hover = false
  let styleHover = false
  let add: boolean = false
  let addStyle: boolean = false
  let text: boolean = false

  function setHover(type: string) {
    function inner() {
      if (type === 'props') {
        hover = true
      } else if (type === 'style') {
        styleHover = true
      }
    }
    return inner
  }

  function unsetHover(type: string) {
    function inner() {
      if (type === 'props') {
        hover = false
      } else if (type === 'style') {
        styleHover = false
      }
    }
    return inner
  }

  function openAdd() {
    add = true
  }

  function openAddStyle() {
    addStyle = true
  }

  function openText() {
    text = true
  }

  function closeText() {
    text = false
  }
</script>

<div class="root">
  {#if $selected.id}
    <span
      on:mouseover={setHover('props')}
      on:focus={setHover('props')}
      on:mouseleave={unsetHover('props')}
      on:blur={unsetHover('props')}
    >
      props: &#123;
      <span class="add" class:hover on:click={openAdd}>+</span>
    </span>
    {#each Object.keys($selected.props.value) as name}
      <Prop bind:data={$selected.props.value} {name} />
    {/each}
    <div>&#125;</div>
    <div
      on:mouseover={setHover('style')}
      on:focus={setHover('style')}
      on:mouseleave={unsetHover('style')}
      on:blur={unsetHover('style')}
    >
      style: &#123;
      <span class="add" class:hover={styleHover} on:click={openAddStyle}>+</span
      >
    </div>
    {#each Object.keys($selected.style.value) as name}
      <Prop bind:data={$selected.style.value} {name} />
    {/each}
    <div>&#125;</div>
    {#if text}
      <TextEdit data={$selected} onClose={closeText} />
    {:else}
      <div on:click={openText}>text: {$selected.text}</div>
    {/if}
  {/if}
</div>

<AddProp bind:open={add} bind:data={$selected.props} />
<AddProp bind:open={addStyle} bind:data={$selected.style} />

<style>
  .root {
    height: 100%;
    width: 100%;
    overflow: auto;
  }

  .add {
    color: #0000;
  }

  .hover {
    color: black;
  }
</style>
