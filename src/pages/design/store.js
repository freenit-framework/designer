import { action, makeAutoObservable } from 'mobx'

class DesignStore {
  over = {}
  selected = {}
  tree = {
    identity: 'root',
    name: 'div',
    type: 'html',
    text: 'root',
    props: {
      style: {
        height: 'calc(100vh - 2px)',
      },
    },
    children: [],
  }

  constructor() {
    makeAutoObservable(this)
  }

  setOver = action((data) => {
    this.over = data
  })

  setSelected = action((data) => {
    this.selecte = data
  })

  change = action(() => {
    this.tree.props.style.backgroundColor = 'red'
  })
}

const store = new DesignStore()
export default store
