export default class DesignStore {
  constructor(tree, selected, editing, over, rearranging) {
    this.tree = tree[0]
    this.setTree = tree[1]
    this.selected = selected[0]
    this.setSelected = selected[1]
    this.editing = editing[0]
    this.setEditing = editing[1]
    this.over = over[0]
    this.setOver = over[1]
    this.rearranging = rearranging[0]
    this.setRearranging = rearranging[1]
  }

  copyItem = (item) => {
    const newitem = {
      ...item,
      identity: Math.random(),
      existing: true,
    }
    newitem.children = newitem.children.map(item => this.copyItem(item))
    return newitem
  }

  add = (item, parent) => {
    const newitem = this.copyItem(item)
    parent.children.push(newitem)
    if (item.existing) {
      this.remove(item)
    }
    this.setSelected(newitem)
    this.setEditing({})
  }

  rearrange = (item, parent, before) => {
    if (!parent || before.identity === this.tree.identity) { return }
    const identity = Math.random()
    const newitem = {
      ...item,
      identity,
      existing: true,
    }
    const index = parent.children.findIndex(
      item => item.identity === before.identity
    )
    if (index >= 0) {
      parent.children.splice(index, 0, newitem)
      if (item.existing) {
        this.remove(item)
      }
      this.setSelected(newitem)
    }
    this.setEditing({})
  }

  onClick = (component) => {
    this.setSelected(component)
    this.setEditing({})
  }

  removeComponent = (identity, tree = this.tree) => {
    const newtree = { ...tree }
    newtree.children = newtree.children.filter(
      component => component.identity !== identity,
    )
    newtree.children = newtree.children.map(
      component => this.removeComponent(identity, component),
    )
    return newtree
  }

  remove = (component = this.selected) => {
    if (!component) {
      return
    }
    if (!component.identity) {
      return
    }
    const { identity } = component
    if (identity === this.tree.identity) {
      return
    }
    const tree = this.removeComponent(identity)
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
      let value = Number(v)
      if (v === '{}') {
        delete result.value
        result.children = []
      } else if (v === '[]') {
        result.value = []
      } else if (!isNaN(value)) {
        result.value = value
      } else {
        result.value = v
      }
      return result
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

  addNewProp = (prop) => {
    const result = { ...prop }
    if (result.identity === this.over.identity) {
      const child = {
        identity: Math.random(),
        value: 'value',
      }
      if (result.children) {
        result.children.push({
          ...child,
          name: Math.random().toString(36).substring(7),
        })
      }
      if (Array.isArray(result.value)) {
        result.value.push(child)
      }
      return result
    }
    if (result.children) {
      result.children = result.children.map(item => this.addNewProp(item))
    }
    if (Array.isArray(result.value)) {
      result.value = result.value.map(item => this.addNewProp(item))
    }
    return result
  }

  removeExistingProp = (prop) => {
    const result = { ...prop }
    if (result.children) {
      result.children = result.children.filter(
        item => item.identity !== this.over.identity,
      ).map(item => this.removeExistingProp(item))
    }
    if (result.value && Array.isArray(result.value)) {
      result.value = result.value.filter(
        item => item.identity !== this.over.identity,
      ).map(item => this.removeExistingProp(item))
    }
    return result
  }

  addProp = () => {
    const component = this.findComponent(this.selected.identity)
    component.props = this.addNewProp(component.props)
    this.setEditing({})
  }

  removeProp = () => {
    const component = this.findComponent(this.selected.identity)
    component.props = this.removeExistingProp(component.props)
    this.setEditing({})
  }

  setText = (text) => {
    const component = this.findComponent(this.selected.identity)
    component.text = text
    this.setEditing({})
  }
}
