import { rest } from 'utils'


export default {
  send: async (data) => {
    const response = await rest.post('/landing/form', data)
    return response.data
  },
}
