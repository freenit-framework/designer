<script lang="ts">
  import {
    mdiArrowLeftBold,
    mdiUndo,
    mdiRedo,
    mdiSelectSearch,
  } from '@mdi/js'
  import store from '$lib/store'

  let { toggle } = $props()
</script>

<div class="views">
  <button class="button outline" disabled>Components</button>
  <button class="button outline">Icons</button>
  <button disabled class="button outline">Props</button>
  <button class="button outline">Theme</button>
  <svg class="icon" role="button" tabindex={0} onclick={toggle} onkeyup={toggle}>
    <path d={mdiArrowLeftBold} />
  </svg>
</div>
<div class="tools">
  <input class="search" bind:value={store.design.filter} />
  <div class="actions">
    <svg class="icon">
      <path d={mdiUndo} />
    </svg>
    <svg class="icon">
      <path d={mdiRedo} />
    </svg>
    <svg class="icon">
      <path d={mdiSelectSearch} />
    </svg>
  </div>
</div>

<style>
  .views {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: white;
    padding: 5px;
  }

  .search {
    width: 50%;
  }

  .actions {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .icon {
    width: 26px;
    height: 26px;
    fill: #666;
  }

  .tools {
    padding: 5px;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  }
</style>
