import { makeAutoObservable } from 'mobx'
import { compile } from 'components'
import { makeid } from 'utils'


export default class TreeStore {
  tree = compile({
    children: [],
    component: 'div',
    name: 'div',
    props: { style: { minHeight: 'calc(100vh - 4px)' } },
  })

  constructor() {
    makeAutoObservable(this)
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
    if (item.existing) { this.remove(item) }
    return newitem
  }

  removeComponent = (identity, tree = this.tree) => {
    const newtree = { ...tree }
    newtree.children = newtree.children.filter(
      component => component.identity !== identity
    )
    newtree.children = newtree.children.map(
      component => this.removeComponent(identity, component)
    )
    return newtree
  }

  remove = (component) => {
    if (!component) { return }
    if (!component.identity) { return }
    const { identity } = component
    if (identity === this.tree.identity) { return }
    const newtree = this.removeComponent(identity)
    this.tree = { ...newtree }
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
    }
  }

  removeProp = (item, props) => {
    if (props.children) {
      props.children = props.children.filter(
        prop => item.identity !== prop.identity
      )
      props.children.forEach(prop => this.removeProp(item, prop))
    }
    if (props.value && Array.isArray(props.value)) {
      props.value = props.value.filter(
        prop => item.identity !== prop.identity,
      )
      props.value.forEach(prop => this.removeProp(item, prop))
    }
    return item
  }

  findComponent = (identity, tree = this.tree) => {
    if (tree.identity === identity) {
      return tree
    }
    let result = {}
    tree.children.forEach(comp => {
      if (!result.identity) {
        const res = this.findComponent(identity, comp)
        if (res.identity) { result = res }
      }
    })
    return result
  }

  addNewProp = (prop, identity, data) => {
    const result = { ...prop }
    if (result.identity === identity) {
      const child = { ...data, identity: makeid(8) }
      if (data.value.children) { child.children = data.value.children }
      else { child.value = data.value }
      if (result.children) { result.children = [ ...result.children, child ] }
      if (Array.isArray(result.value)) {
        result.value = [ ...result.value, child ]
      }
      return result
    }
    if (result.children) {
      result.children = result.children.map(
        item => this.addNewProp(item, identity, data)
      )
    }
    if (Array.isArray(result.value)) {
      result.value = result.value.map(
        item => this.addNewProp(item, identity, data)
      )
    }
    return result
  }

  addProp = (identity, data, component) => {
    component.props = this.addNewProp(component.props, identity, data)
  }

  changePropName = (prop, name, identity) => {
    const result = { ...prop }
    if (result.identity === identity) { return { ...result, name } }
    if (result.children) { // object
      result.children = prop.children.map(
        item => this.changePropName(item, name, identity),
      )
    }
    if (result.value) { // array
      if (Array.isArray(result.value)) {
        result.value = result.value.map(
          item => this.changePropName(item, name, identity)
        )
      }
    }
    return result
  }

  changePropValue = (prop, v, identity) => {
    const result = { ...prop }
    if (result.identity === identity) { // simple value
      result.value = v
      return result
    }
    if (result.children) { // object
      result.children = result.children.map(
        item => this.changePropValue(item, v, identity),
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

  changePropType = (prop, type, identity) => {
    const result = { ...prop }
    if (result.identity === identity) {
      const data = {
        ...result,
        type,
      }
      return data
    }
    if (result.children) { // object
      result.children = prop.children.map(
        item => this.changePropType(item, type),
      )
    }
    if (result.value) { // array
      if (Array.isArray(result.value)) {
        result.value = result.value.map(
          item => this.changePropType(item, type)
        )
      }
    }
    return result
  }

  setPropName = (name, component, identity) => {
    component.props = this.changePropName(component.props, name, identity)
  }

  setPropValue = (value, component, identity) => {
    component.props = this.changePropValue(component.props, value, identity)
  }

  setPropType = (type, component, identity) => {
    component.props = this.changePropType(component.props, type, identity)
  }

  setText = (text, component) => {
    component.text = text
  }

  changePropFile = (prop, data, identity) => {
    const result = { ...prop }
    if (result.identity === identity) { // simple value
      result.pre = data.pre
      result.post = data.post
      result.file = data.file
      result.type = data.type
      return result
    }
    if (result.children) { // object
      result.children = result.children.map(
        item => this.changePropFile(item, data, identity),
      )
    }
    if (result.value) { // array
      if (Array.isArray(result.value)) {
        result.value = result.value.map(
          item => this.changePropFile(item, data, identity)
        )
      }
    }
    return result
  }

  setPropFile = (data, component, identity) => {
    component.props = this.changePropFile(component.props, data, identity)
  }

  showSelected = (selected, tree = this.tree) => {
    if (!selected.identity) { return false }
    if (selected.identity === tree.identity) {
      tree.open = !Boolean(tree.open)
      return true
    }
    let found = false
    tree.children.forEach(comp => {
      if (!found && this.showSelected(selected, comp)) {
        found = true
        tree.open = true
      }
    })
    return found
  }
}
