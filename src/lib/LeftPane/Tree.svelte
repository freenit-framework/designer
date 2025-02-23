<script lang="ts">
  import { mdiClose, mdiMenuUp } from '@mdi/js'
</script>

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

<style>
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

  .icon {
    width: 26px;
    height: 26px;
    fill: #666;
  }
</style>
