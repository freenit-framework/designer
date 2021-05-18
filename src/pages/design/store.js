import { action, makeAutoObservable } from 'mobx'

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
    props: {
      style: {
        height: 'calc(100vh - 2px)',
      },
    },
    children: [
      {
        identity: 'something',
        name: 'div',
        type: 'html',
        text: '',
        props: {},
        children: [],
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
    this.selecte = data
  })
}

const store = new DesignStore()
export default store
