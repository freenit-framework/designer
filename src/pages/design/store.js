export default class DesignStore {
  constructor(tree, selected, hover) {
    this.tree = tree[0]
    this.setTree = tree[1]
    this.selected = selected[0]
    this.setSelected = selected[1]
  }

  add = (item, tree = this.tree) => {
    const result = { ...tree }
    if (result.key === this.selected.key) {
      const key = Math.random()
      const newitem = {
        ...item,
        key,
        children: [],
      }
      result.children.push(newitem)
      this.setSelected(newitem)
    } else {
      result.children = result.children.map(el => this.add(item, el))
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

  setOverComponent = (identity, component = this.tree) => {
    if (component.key === identity) {
      this.setSelected(component)
    } else {
      component.children.forEach(child => this.setOverComponent(identity, child))
    }
  }
}
