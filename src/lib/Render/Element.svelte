<script lang="ts">
  const { component } = $props()
</script>

<component.component {...component.props}>
  {#each component.children as child}
    <Element component={child} />
  {/each}
  {component.text}
</component.component>
