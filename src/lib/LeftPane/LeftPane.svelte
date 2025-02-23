<script lang="ts">
  import { mdiArrowRightBold } from '@mdi/js'
  import BottomTools from './BottomTools.svelte'
  import Components from './Components.svelte'
  import Props from './Props.svelte'
  import TopTools from './TopTools.svelte'
  import Tree from './Tree.svelte'

  let hidden = $state(false)

  const toggleHide = () => {
    hidden = !hidden
  }
</script>

<div class="root" class:hidden>
  {#if !hidden}
    <TopTools toggle={toggleHide} />
    <div class="components">
      <Components />
      <div class="render">
        <Tree />
        <Props />
      </div>
    </div>
    <BottomTools />
  {:else}
    <div class="tools">
      <svg class="icon" role="button" tabindex={0} onclick={toggleHide} onkeyup={toggleHide}>
        <path d={mdiArrowRightBold} />
      </svg>
    </div>
    <div class="components"></div>
  {/if}
</div>

<style>
  .root {
    height: 100%;
    max-width: 600px;
    width: 100%;
    background-color: #fafaff;
    display: flex;
    align-items: stretch;
    justify-content: center;
    flex-direction: column;
    border-right: dotted 1px gray;
    transition: max-width 1s;
  }

  .hidden {
    max-width: 50px;
  }

  .tools {
    padding: 5px;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon {
    width: 26px;
    height: 26px;
    fill: #666;
  }

  .components {
    flex: 1;
    display: flex;
    align-items: stretch;
    justify-content: center;
    overflow: auto;
  }

  .render {
    width: 50%;
    padding: 5px;
  }
</style>
