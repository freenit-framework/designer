<script lang="ts">
  import { Input } from '@freenit-framework/core'
  import ColorPicker from 'svelte-awesome-color-picker'
  import { colord } from 'colord'
  import mytype from '$lib/mytype'
  import type { Colord } from 'colord'

  const hex = '#000000'
  let { notype = $bindable(false), value = $bindable(), name = $bindable(''), noname = $bindable(false) } = $props()

  const changeType = (event: Event) => {
    const mytype = (event.target as HTMLInputElement).value
    if (mytype === 'string') {
      value = ''
    } else if (mytype === 'number') {
      value = 0
    } else if (mytype === 'boolean') {
      value = false
    } else if (mytype === 'color') {
      value = colord('#000000')
    }
  }
</script>

{#if !notype}
<select value={mytype(value)} onchange={changeType}>
  <option value="string">string</option>
  <option value="number">number</option>
  <option value="bool">bool</option>
  <option value="color">color</option>
</select>
{/if}

{#if !noname}
  <Input label="name" type="text" name="name" bind:value={name} autofocus />
{/if}
{#if mytype(value) === 'string'}
  <Input label="value" type="text" name="value" bind:value />
{:else if mytype(value) === 'number'}
  <Input label="value" type="number" name="value" bind:value />
{:else if mytype(value) === 'color'}
  <div class="margin"></div>
  <ColorPicker {hex} bind:color={value as Colord} isDialog={false} />
{/if}

<style>
  .margin {
    margin-top: 10px;
  }
</style>
