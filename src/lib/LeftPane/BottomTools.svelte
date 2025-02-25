<script lang="ts">
  import { mdiCellphone, mdiTablet, mdiLaptop } from '@mdi/js'
  import Color from '$lib/color'
  import '$lib/type.extensions'

  const s = 'cvrc'
  const n = 3
  const b = false
  const c = new Color(1, 21, 45, 1)
  console.log(s, s.vtype())
  console.log(n, n.vtype())
  console.log(b, b.vtype())
  console.log(c, c.vtype())
</script>

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

<style>
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

  .icon {
    width: 26px;
    height: 26px;
    fill: #666;
  }
</style>
