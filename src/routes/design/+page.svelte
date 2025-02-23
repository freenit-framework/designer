<script lang="ts">
  import LeftPane from '$lib/LeftPane'
  import store from '$lib/store'

  const allowDrop = (event: Event) => {
    event.preventDefault()
  }

  const drop = (component: Component) => (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const json = event.dataTransfer ? event.dataTransfer.getData('component') : ''
    const data = JSON.parse(json)
    console.log(data)
    if (component) {
      component.children.push(data)
    } else {
      store.design.design.push(data)
    }
    console.log('design', store.design.design)
  }
</script>

<div class="root">
  <LeftPane />
  <div class="render" ondragover={allowDrop} ondrop={drop(null)}>
    {#each store.design.design as component}
      <div>{component.name}</div>
    {/each}
  </div>
</div>

<style>
  .root {
    height: 100dvh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .render {
    height: 100%;
    flex: 1;
  }
</style>
