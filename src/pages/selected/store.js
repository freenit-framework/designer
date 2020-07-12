export default class DesignStore {
  constructor(selected) {
    this.selected = selected[0]
    this.setSelected = selected[1]
  }

  select = (component) => {
    this.setSelected(component)
  }
}
