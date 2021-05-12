import { action, makeAutoObservable } from 'mobx'
import { convert } from 'components'
import { makeid } from 'utils'

export default class ThemeStore {
  theme = convert('theme', { palette: {} })

  constructor() {
    makeAutoObservable(this)
  }

  addNewProp = action((prop, identity, data) => {
    const result = { ...prop }
    if (result.identity === identity) {
      const child = { ...data, identity: makeid(8) }
      if (data.value.children) {
        child.children = data.value.children
      } else {
        child.value = data.value
      }
      if (result.children) {
        result.children = [...result.children, child]
      }
      if (Array.isArray(result.value)) {
        result.value = [...result.value, child]
      }
      return result
    }
    if (result.children) {
      result.children = result.children.map((item) =>
        this.addNewProp(item, identity, data)
      )
    }
    if (Array.isArray(result.value)) {
      result.value = result.value.map((item) =>
        this.addNewProp(item, identity, data)
      )
    }
    return result
  })

  addProp = action((identity, data) => {
    this.theme = this.addNewProp(this.theme, identity, data)
  })

  setPropName = action((prop, name) => {
    prop.name = name
  })

  setPropType = action((prop, type) => {
    prop.type = type
  })

  setPropValue = action((prop, value) => {
    prop.value = value
  })

  removeOldProp = action((item, props) => {
    if (props.children) {
      props.children = props.children.filter(
        (prop) => item.identity !== prop.identity
      )
      props.children.forEach((prop) => this.removeOldProp(item, prop))
    }
    if (props.value && Array.isArray(props.value)) {
      props.value = props.value.filter(
        (prop) => item.identity !== prop.identity
      )
      props.value.forEach((prop) => this.removeOldProp(item, prop))
    }
    return item
  })

  removeProp = action((item) => {
    this.removeOldProp(item, this.theme)
  })
}
