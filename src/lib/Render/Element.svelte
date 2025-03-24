<script lang="ts">
  import store from '$lib/store'
  import style from '$lib/style'
  import Element from './Element.svelte'

  const { component } = $props()
  let css = $state(style(component.css))

  $effect(() => {
    if (store.design.selected?.id === component.id) {
      css = style({ ...component.css, border: '1px dotted gray' })
    } else {
      css = style(component.css)
    }
  })
</script>

<component.component {...component.props} style={css}>
  {#each component.children as child}
    <Element component={child} />
  {/each}
  {component.text}
</component.component>
