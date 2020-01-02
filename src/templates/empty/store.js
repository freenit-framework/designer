export default class NotificationStore {
  constructor(detail) {
    this.detail = detail[0]
    this.setDetail = detail[1]
  }

  show = async (message) => {
    this.setDetail({
      message,
      show: true,
    })
  }

  close = async () => {
    this.setDetail({ show: false })
  }
}
