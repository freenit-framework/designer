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
    if (result.identity === this.tree.identity) {
      this.setTree(result)
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

  changePropName = (prop, name) => {
    const result = { ...prop }
    if (result.identity === this.editing.identity) {
      const data = {
        ...result,
        name,
      }
      return data
    }
    if (result.children) { // object
      result.children = prop.children.map(
        item => this.changePropName(item, name),
      )
    }
    if (result.value) { // array
      if (Array.isArray(result.value)) {
        result.value = result.value.map(item => this.changePropName(item, name))
      }
    }
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
    if (result.children) { // object
      result.children = result.children.map(
        item => this.changePropValue(item, v),
      )
    }
    if (result.value) { // array
      if (Array.isArray(result.value)) {
        result.value = result.value.map(item => this.changePropValue(item, v))
      }
    }
    return result
  }

  setPropName = (name) => {
    const component = this.findComponent(this.selected.identity)
    component.props = this.changePropName(component.props, name)
    this.setEditing({})
  }

  setPropValue = (value) => {
    const component = this.findComponent(this.selected.identity)
    component.props = this.changePropValue(component.props, value)
    this.setEditing({})
  }
}
