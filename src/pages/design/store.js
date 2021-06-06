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
    children: [
      {
        identity: 'something',
        name: 'div',
        type: 'html',
        text: 'sub',
        opened: false,
        children: [],
        component: 'div',
        props: compile({
          style: {
            backgroundColor: 'gray',
          },
        }),
      },
    ],
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

  setTheme = action((data) => {
    this.theme = data
  })

  setTree = action((data) => {
    this.tree = data
  })

  setChildren = action((data) => {
    this.tree.children = data
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
