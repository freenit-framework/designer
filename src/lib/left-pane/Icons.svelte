<script lang="ts">
  import { dragStart, dragEnd } from '$lib/utils'
  import icons from '$lib/components/icons'

  let search = ''

  $: items = icons.filter((item) => item.title.toLowerCase().includes(search))

  function changeSearch(event: any) {
    search = event.target.value
  }
</script>

<div class="search">
  <input on:input={changeSearch} />
</div>

<div class="root">
  {#each items as item (item.id)}
    <span
      draggable="true"
      on:dragstart={dragStart(item)}
      on:dragend={dragEnd}
      title={item.title}
    >
      <svg class="icon">
        <path d={item.data} />
      </svg>
    </span>
  {/each}
</div>

<style>
  .root {
    flex: 1;
    overflow: auto;
    width: 100%;
  }

  .icon {
    height: 32px;
    width: 32px;
    margin: 0px 5px;
    fill: #666;
  }

  .search {
    padding: 10px;
    width: 100%;
  }
</style>
