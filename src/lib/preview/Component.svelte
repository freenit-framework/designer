<script lang="ts">
  import { selected } from '$lib/store'
  import { compile, decompile } from '$lib/utils/props'

  export let data = {
    id: '',
    component: '',
    props: compile({}),
    style: compile({}),
    children: [],
    text: '',
  }
  $: style = {
    ...decompile(data.style),
    cursor: 'grab',
    'user-select': 'none',
    'border-width': $selected.id === data.id ? '1px' : '0px',
    'border-color': 'black',
    'border-style': 'dotted',
  }
</script>

<svelte:component this={data.component} props={decompile(data.props)} {style}>
  {data.text}
  {#each data.children as item (item.id)}
    <svelte:self bind:data={item} />
  {/each}
</svelte:component>
