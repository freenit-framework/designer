import service from './service'
import initial from './initial'


export default class LandingStore {
  constructor(detail) {
    this.detail = detail[0]
    this.setDetail = detail[1]
  }

  send = async () => {
    try {
      const response = await service.send(this.organizer)
      const result = {
        ...response,
        ok: true
      }
      this.setDetail(result)
      return result
    } catch (error) {
      const result = {
        ...initial.detail,
        ok: false,
      }
      this.setDetail(result)
      return {
        ...error,
        ...result,
      }
    }
  }
}
