<script lang="ts">
  import PreviewElement from './PreviewElement.svelte'
  const { component } = $props()
</script>

<component.component
  {...component.props}
  class={component.props.class ? `${component.id} ${component.props.class}` : component.id}
  data-testid={component.id}
>
  {#each component.children as child}
    <PreviewElement component={child} />
  {/each}
  {component.text}
</component.component>
