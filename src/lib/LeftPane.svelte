<script lang="ts">
  import {
    mdiArrowLeftBold,
    mdiArrowRightBold,
    mdiUndo,
    mdiRedo,
    mdiSelectSearch,
    mdiClose,
    mdiMenuUp,
    mdiCellphone,
    mdiTablet,
    mdiLaptop,
  } from '@mdi/js'

  let hidden = $state(false)

  const toggleHide = () => {
    hidden = !hidden
  }
</script>

<div class="root" class:hidden>
  {#if !hidden}
    <div class="views">
      <button class="button outline" disabled>Components</button>
      <button class="button outline">Icons</button>
      <button disabled class="button outline">Props</button>
      <button class="button outline">Theme</button>
      <svg class="hide" role="button" tabindex={0} onclick={toggleHide} onkeyup={toggleHide}>
        <path d={mdiArrowLeftBold} />
      </svg>
    </div>
    <div class="tools">
      <input class="search" />
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
    <div class="components">
      <div class="component-list">
        <div class="component">div</div>
      </div>
      <div class="render">
        <div class="tree">
          <div class="element">
            <div class="data">
              <div>div</div>
              <div class="id">IUxlpXlW</div>
            </div>
            <div>
              <svg class="icon">
                <path d={mdiClose} />
              </svg>
            </div>
            <div class="ufBQjmyA">
              <svg class="icon">
                <path d={mdiMenuUp} />
              </svg>
            </div>
          </div>
        </div>
        <div class="attributes">
          <div class="props">
            <span>props: &#123; +</span>
          </div>
          <div class="prop">
            <span>class: root -</span>
          </div>
          <div>&#125;</div>
          <div>
            <span>css: &#123; +</span>
          </div>
          <div class="ewXLBPxm">
            <span>height: 100dvh -</span>
          </div>
          <div>&#125;</div>
          <div>text:</div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="bottom-actions">
        <button class="button outline">Save</button>
        <button class="button outline primary">Load</button>
        <button class="button outline">Export</button>
      </div>
      <div class="bottom-actions">
        <svg class="icon">
          <path d={mdiCellphone} />
        </svg>
        <svg class="icon">
          <path d={mdiTablet} />
        </svg>
        <svg class="icon">
          <path d={mdiLaptop} />
        </svg>
      </div>
    </div>
  {:else}
    <div class="tools">
      <svg class="hide" role="button" tabindex={0} onclick={toggleHide} onkeyup={toggleHide}>
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

  .views {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: white;
    padding: 5px;
  }

  .hide {
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

  .components {
    flex: 1;
    display: flex;
    align-items: stretch;
    justify-content: center;
  }

  .component-list {
    width: 50%;
    padding: 5px;
    border-right: 1px solid #eee;
  }

  .component {
    padding: 5px;
    border-radius: 5px;
    background-color: rgba(128, 128, 128, 0.1);
    margin-bottom: 5px;
  }

  .render {
    width: 50%;
    padding: 5px;
  }

  .tree {
    height: 50%;
  }

  .element {
    border-radius: 5px;
    background-color: rgba(128, 128, 128, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 5px;
  }

  .data {
    flex: 1;
    padding: 5px;
  }

  .id {
    color: #888;
  }

  .props {
    margin-top: 5px;
    border-top: solid 1px #eee;
    padding: 5px;
    height: 50%;
  }

  .prop {
    margin-left: 10px;
  }

  .ewXLBPxm {
    margin-left: 10px;
  }

  .bottom {
    background-color: white;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bottom-actions {
    width: 50%;
    justify-content: space-around;
    align-items: center;
    display: flex;
  }
</style>
