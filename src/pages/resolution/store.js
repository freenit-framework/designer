export default class ResolutionStore {
  constructor(detail) {
    this.detail = detail[0]
    this.setDetail = detail[1]
    window.onresize = () => {
      this.setDetail({
        height: window.innerHeight,
        width: window.innerWidth,
      })
    }
  }
}
