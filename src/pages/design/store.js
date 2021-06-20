import { action, makeAutoObservable } from 'mobx'
import { compile } from 'utils'

class DesignStore {
  device = 'desktop'
  keybind = {
    ctrl: false,
    shift: false,
    alt: false,
  }
  over = {}
  rearrange = false
  selected = {}
  theme = compile({})
  tree = {
    identity: 'root',
    name: 'div',
    type: 'html',
    text: '',
    opened: false,
    component: 'div',
    props: compile({
      style: {
        height: 'calc(100vh - 4px)',
      },
    }),
    children: [],
  }

  constructor() {
    makeAutoObservable(this)
  }

  setDevice = action((device) => {
    this.device = device
  })

  setOver = action((data) => {
    this.over = data
  })

  setRearrange = action((data) => {
    this.rearrange = data
  })

  setSelected = action((data) => {
    this.selected = data
  })

  setTree = action((data) => {
    this.tree.children = data.children
    this.tree.props = data.props
    this.tree.text = data.text
  })

  setChildren = action((data) => {
    this.tree.children = data
  })

  load = action((data) => {
    this.setTree(data.tree)
    this.theme = compile(data.theme)
  })

  remove = action((data, tree = this.tree) => {
    if (data.identity === 'root') {
      return
    }
    tree.children = tree.children.filter(
      (child) => child.identity !== data.identity
    )
    tree.children.forEach((child) => this.remove(data, child))
  })

  find = (data, tree = this.tree) => {
    if (data.identity === tree.identity) {
      return tree
    }
    let result = null
    tree.children.forEach((child) => {
      const r = this.find(data, child)
      if (r) {
        result = r
      }
    })
    return result
  }
}

const store = new DesignStore()
export default store
