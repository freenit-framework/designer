<script lang="ts">
  import store from '$lib/store'
  import style from '$lib/style'
  import { dragStart, dragEnd } from '$lib/dnd'
  import { makeid } from '$lib/utils'
  import type { Component } from '$lib/types'
  import * as icons from '@mdi/js'
  import { Path, Svg } from '$lib/components'

  const iconcomponents: Component[] = Object.keys(icons).map((title) => ({
    name: 'Svg',
    id: makeid(),
    component: Svg,
    title,
    text: '',
    props: {},
    css: {
      width: '26px',
      height: '26px',
      fill: '#666',
    },
    children: [
      {
        name: 'Path',
        id: makeid(),
        component: Path,
        title,
        text: '',
        props: { d: icons[title] },
        children: [],
        css: {
          width: '26px',
          height: '26px',
          fill: '#666',
        },
      },
    ],
  }))

  let c: Component[] = $state(
    iconcomponents.filter((e) => e.title.toLowerCase().includes(store.design.filter.toLowerCase())),
  )
  $effect(() => {
    c = iconcomponents.filter((e) =>
      e.title.toLowerCase().includes(store.design.filter.toLowerCase()),
    )
  })
</script>

<div class="root">
  {#each c as component}
    <span
      draggable="true"
      ondragstart={dragStart(component)}
      ondragend={dragEnd}
      role="none"
      title={component.title}
    >
      <Svg style={style(component.css)}>
        {#each component.children as child}
          <Path style={style(child.css)} d={child.props.d}></Path>
        {/each}
      </Svg>
    </span>
  {/each}
</div>

<style>
  .root {
    width: 50%;
    padding: 5px;
    border-right: 1px solid #eee;
    overflow: auto;
  }
</style>
