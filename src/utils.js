import axios from 'axios'


export const API_ROOT = '/api/v0'


export const rest = axios.create({
  baseURL: API_ROOT,
  withCredentials: true,
})

rest.interceptors.request.use(
  (config) => {
    const csrfType = config.url === '/auth/refresh'
      ? 'csrf_refresh_token'
      : 'csrf_access_token'
    const csrf = getCookie(csrfType)
    config.headers.withCredentials = true
    if (csrf) {
      config.headers['X-CSRF-TOKEN'] = csrf
    }
    return config
  },

  (err) => {
    return Promise.reject(err)
  },
)


export const getCookie = (name) => {
  var value = "; " + document.cookie
  var parts = value.split("; " + name + "=")
  if (parts.length === 2) return parts.pop().split(";").shift()
}


export const errors = (response) => {
  const data = response.response && response.response.data
    ? response.response.data
    : {}
  if (!data.message) {
    if (data.msg) {
      data.message = data.msg
    } else if (data.statusText) {
      data.message = data.statusText
    } else if (data.status) {
      data.message = data.status
    }
  }
  if (data.errors){
    Object.getOwnPropertyNames(data.errors).forEach(property => {
      if (property !== 'message') {
        data.errors[property] = data.errors[property].join(' ')
      }
    })
  }
  return data
}
