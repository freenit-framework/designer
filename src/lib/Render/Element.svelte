<script lang="ts">
  import store from '$lib/store'
  import style from '$lib/style'
  import Element from './Element.svelte'

  const { component } = $props()

  const select = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    store.design.selected = component
  }

  let css = $derived.by(() => {
    if (store.design.selected?.id === component.id) {
      return style({ ...component.css, border: '1px dotted gray' })
    }
    return style(component.css)
  })
</script>

<component.component {...component.props} style={css} data-testid={component.id} onclick={select}>
  {#each component.children as child}
    <Element component={child} />
  {/each}
  {component.text}
</component.component>
