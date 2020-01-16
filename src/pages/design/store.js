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
      this.setEditing({})
    } else {
      result.children = result.children.map(el => this.add(item, parentIdentity, el))
    }
    return result
  }

  onClick = (component) => {
    this.setSelected(component)
    this.setEditing({})
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

  containsProp = (prop, identity) => {
    if (prop.identity === identity) { // simple value
      return true
    }
    if (prop.children) { // object
      return prop.children.reduce(
        (result, current) => Boolean(
          result || this.containsProp(current, identity),
        ),
        false,
      )
    }
    if (prop.value) { // array
      if (Array.isArray(prop.value)) {
        return prop.value.reduce(
          (result, current) => Boolean(
            result || this.containsProp(current, identity),
          ),
          false,
        )
      }
    }
    return false
  }

  findComponent = (identity, tree = this.tree) => {
    if (tree.identity === identity) {
      return tree
    }
    let result = {}
    tree.children.forEach(comp => {
      const res = this.findComponent(identity, comp)
      if (res.identity) {
        result = res
      }
    })
    return result
  }

  changePropValue = (prop, v) => {
    const result = { ...prop }
    if (result.identity === this.editing.identity) { // simple value
      const value = Number(v)
      return {
        ...result,
        value: isNaN(value) ? v : value,
      }
    }
    if (prop.children) { // object
      prop.children = prop.children.map(
        item => this.changePropValue(item, v),
      )
    }
    if (prop.value) { // array
      if (Array.isArray(prop.value)) {
        prop.value = prop.value.map(item => this.changePropValue(item, v))
      }
    }
    return result
  }

  setPropValue = (value) => {
    const component = this.findComponent(this.selected.identity)
    component.props = this.changePropValue(component.props, value)
    this.setEditing({})
  }
}
