<script lang="ts">
  import store from '$lib/store'
  import Element from './Element.svelte'

  const { component } = $props()

  const select = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    store.design.selected = component
  }

  let className = $derived.by(() => {
    const classes = [component.id]
    if (typeof component.props.class === 'string' && component.props.class.trim()) {
      classes.push(component.props.class.trim())
    }
    if (store.design.selected?.id === component.id) {
      classes.push('selected')
    }
    return classes.join(' ')
  })
</script>

<component.component {...component.props} class={className} data-testid={component.id} onclick={select}>
  {#each component.children as child}
    <Element component={child} />
  {/each}
  {component.text}
</component.component>
