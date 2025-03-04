<script lang="ts">
  import Element from './Element.svelte'

  const { component } = $props()

  const style = () => {
    let result = ''
    Object.keys(component.css).forEach(prop => {
      result += `${prop}: ${component.css[prop]};`
    });
    return result
  }
</script>

<component.component {...component.props} style={style()}>
  {#each component.children as child}
    <Element component={child} />
  {/each}
  {component.text}
</component.component>
