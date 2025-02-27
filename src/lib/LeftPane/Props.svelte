<script lang="ts">
  import store from '$lib/store'

  let selected = $derived(store.design.selected)

  const addProp = () => {
    if (selected) {
      selected.props.name = 'myname'
    }
  }
  const addCss = () => {
    if (selected) {
      selected.css.color = 'black'
    }
  }

  const removeCss = (key: string) => () => {
    if (selected) {
      delete selected.css[key]
    }
  }

  const removeProp = (key: string) => () => {
    if (selected) {
      delete selected.props[key]
    }
  }
</script>

{#if selected}
  <div>
    props: &#123; <span onclick={addProp} role="button" onkeyup={addProp} tabindex="0">+</span>
  </div>
  {#each Object.keys(selected.props) as key}
    <div class="prop">
      {`${key}: ${selected.props[key]}`}
      <span onclick={removeProp(key)} role="button" onkeyup={removeProp(key)} tabindex="0">-</span>
    </div>
  {/each}
  <div>&#125;</div>
  <div>
    css: &#123; <span onclick={addCss} role="button" onkeyup={addCss} tabindex="0">+</span>
  </div>
  {#each Object.keys(selected.css) as key}
    <div class="prop">
      {`${key}: ${selected.css[key]}`}
      <span onclick={removeCss(key)} role="button" onkeyup={removeCss(key)} tabindex="0">-</span>
    </div>
  {/each}
  <div>&#125;</div>
  <div>text: {`${selected.text}`}</div>
{/if}

<style>
  .prop {
    margin-left: 10px;
  }
</style>
