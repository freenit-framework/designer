import { makeid } from 'utils'


export default class DesignStore {
  constructor(tree, selected, editing, over, rearranging, theme) {
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
    this.theme = theme[0]
    this.setTheme = theme[1]
  }

  copyItem = (item) => {
    const newitem = {
      ...item,
      identity: makeid(8),
      existing: true,
    }
    if (newitem.children) {
      newitem.children = newitem.children.map(item => this.copyItem(item))
    }
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
    const identity = makeid(8)
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

  changePropName = (prop, name, identity = this.editing.identity) => {
    const result = { ...prop }
    if (result.identity === identity) {
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

  changePropValue = (prop, v, identity = this.editing.identity) => {
    console.log(identity, prop)
    const result = { ...prop }
    if (result.identity === identity) { // simple value
      if (v === '{}') {
        delete result.value
        result.children = []
      } else if (v === '[]') {
        result.value = []
      } else if (!isNaN(Number(v))) {
        result.value = Number(v)
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
        result.value = result.value.map(
          item => this.changePropValue(item, v, identity)
        )
      }
    }
    return result
  }

  setPropName = (name) => {
    const component = this.findComponent(this.selected.identity)
    component.props = this.changePropName(component.props, name)
    this.setEditing({})
  }

  setPropValue = (value, identity = this.editing.identity) => {
    const component = this.findComponent(this.selected.identity)
    component.props = this.changePropValue(component.props, value)
    this.setEditing({})
  }

  addNewProp = (prop, identity, name, value) => {
    const result = { ...prop }
    if (result.identity === identity) {
      const child = { identity: makeid(8), name }
      if (value.children) {
        child.children = value.children
      } else {
        child.value = value
      }
      if (result.children) {
        result.children = [ ...result.children, { ...child, name }]
      }
      if (Array.isArray(result.value)) {
        result.value = [ ...result.value, child ]
      }
      return result
    }
    if (result.children) {
      result.children = result.children.map(
        item => this.addNewProp(item, identity, name, value)
      )
    }
    if (Array.isArray(result.value)) {
      result.value = result.value.map(
        item => this.addNewProp(item, identity, name, value)
      )
    }
    return result
  }

  addProp = (identity, name, value) => {
    const component = this.findComponent(this.selected.identity)
    const newProps = this.addNewProp(component.props, identity, name, value)
    component.props = newProps
    this.setEditing({})
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

  addThemeProp = (identity, name, value) => {
    this.setTheme(this.addNewProp(this.theme, identity, name, value))
  }

  removeThemeProp = () => {
    this.setTheme(this.removeExistingProp(this.theme))
  }

  setThemePropName = (identity, name) => {
    this.setTheme(this.changePropName(this.theme, name, identity))
    this.setEditing({})
  }

  setThemePropValue = (identity, value) => {
    this.setTheme(this.changePropValue(this.theme, value, identity))
    this.setEditing({})
  }
}
