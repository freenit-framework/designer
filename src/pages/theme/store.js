import { makeid } from 'utils'


export default class DesignStore {
  constructor(theme) {
    this.theme = theme[0]
    this.setTheme = theme[1]
  }

  addNewProp = (prop, identity, data) => {
    const result = { ...prop }
    if (result.identity === identity) {
      const child = { ...data, identity: makeid(8) }
      if (data.value.children) {
        child.children = data.value.children
      } else {
        child.value = data.value
      }
      if (result.children) {
        result.children = [ ...result.children, child ]
      }
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

  addProp = (identity, data) => {
    this.setTheme(this.addNewProp(this.theme, identity, data))
  }

  setPropName = (prop, name) => {
    prop.name = name
    this.setTheme({ ...this.theme })
  }

  setPropType = (prop, type) => {
    prop.type = type
    this.setTheme({ ...this.theme })
  }

  setPropValue = (prop, value) => {
    prop.value = value
    this.setTheme({ ...this.theme })
  }
}
