export default class DesignStore {
  constructor(tree, selected, hover) {
    this.tree = tree[0]
    this.setTree = tree[1]
    this.selected = selected[0]
    this.setSelected = selected[1]
    this.hover = hover[0]
    this.setHover = hover[1]
  }

  add = async (item, parentKey = this.tree.key) => {
    const result = { ...this.tree }
    const key = Math.random()
    const newitem = {
      ...item,
      key,
      children: [],
    }
    result.children.push(newitem)
    this.setTree(result)
    this.setSelected(newitem)
    return { ...result, ok: true }
  }

  onHover = (selected) => {
    this.setHover(selected)
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
