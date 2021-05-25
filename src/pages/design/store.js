import { action, makeAutoObservable } from 'mobx'
import { compile } from 'utils'

class DesignStore {
  device = 'desktop'
  over = {}
  rearrange = false
  selected = {}
  theme = {}
  tree = {
    identity: 'root',
    name: 'div',
    type: 'html',
    text: '',
    opened: false,
    props: compile({
      style: {
        height: 'calc(100vh - 4px)',
        overflow: 'auto',
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

  setTheme = action((data) => {
    this.theme = data
  })

  setTree = action((data) => {
    this.tree = data
  })

  setChildren = action((data) => {
    this.tree.children = data
  })
}

const store = new DesignStore()
export default store
