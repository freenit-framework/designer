export default class DesignStore {
  constructor(tree, selected, editing) {
    this.tree = tree[0]
    this.setTree = tree[1]
    this.selected = selected[0]
    this.setSelected = selected[1]
    this.editing = editing[0]
    this.setEditing = editing[1]
  }

  add = (item, parentIdentity, tree = this.tree) => {
    const result = { ...tree }
    if (result.identity === parentIdentity) {
      const identity = Math.random()
      const newitem = {
        ...item,
        identity,
        children: [],
      }
      result.children.push(newitem)
      this.setSelected(newitem)
    } else {
      result.children = result.children.map(el => this.add(item, parentIdentity, el))
    }
    return result
  }

  onClick = (component) => {
    this.setSelected(component)
  }

  removeComponent = (key, tree = this.tree) => {
    const newtree = { ...tree }
    newtree.children = newtree.children.filter(
      component => component.key !== key,
    )
    newtree.children = newtree.children.map(
      component => this.removeComponent(key, component),
    )
    return newtree
  }

  remove = () => {
    if (!this.selected) {
      return
    }
    if (!this.selected.key) {
      return
    }
    const { key } = this.selected
    if (key === this.tree.key) {
      return
    }
    const tree = this.removeComponent(key)
    this.setSelected({})
    this.setTree(tree)
  }
}
