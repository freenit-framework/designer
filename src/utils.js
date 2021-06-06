import axios from 'axios'
import { toJS } from 'mobx'

export const API_ROOT = '/api/v0'

export const rest = axios.create({
  baseURL: API_ROOT,
  withCredentials: true,
})

rest.interceptors.request.use(
  (config) => {
    const csrfType =
      config.url === '/auth/refresh'
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
  }
)

export const getCookie = (name) => {
  var value = '; ' + document.cookie
  var parts = value.split('; ' + name + '=')
  if (parts.length === 2) return parts.pop().split(';').shift()
}

export const errors = (response) => {
  const data =
    response.response && response.response.data ? response.response.data : {}
  if (!data.message) {
    if (data.msg) {
      data.message = data.msg
    } else if (data.statusText) {
      data.message = data.statusText
    } else if (data.status) {
      data.message = data.status
    }
  }
  if (data.errors) {
    Object.keys(data.errors).forEach((property) => {
      if (property !== 'message') {
        data.errors[property] = data.errors[property].join(' ')
      }
    })
  }
  return data
}

export const makeid = (length = 8) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  for (let i = 0; i < length; ++i) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export const isSimple = (data) => {
  return (
    typeof data === 'number' ||
    typeof data === 'boolean' ||
    typeof data === 'string' ||
    typeof data === 'boolean'
  )
}

export const compile = (value) => {
  const result = { identity: makeid() }
  if (isSimple(value)) {
    result.value = value
    result.type = typeof value
    result.name = ''
  } else if (Array.isArray(value)) {
    result.value = value.map((v) => compile(v))
  } else {
    result.value = {}
    Object.keys(value).forEach((name) => {
      result.value[name] = compile(value[name])
    })
  }
  return result
}

export const decompile = (data) => {
  if (data.type === 'file') {
    return `${data.pre}${data.value}${data.post}`
  }
  if (Array.isArray(data.value)) {
    return data.value.map((item) => decompile(item))
  }
  if (isSimple(data.value)) {
    return data.value
  }
  const props = {}
  Object.keys(data.value).forEach((name) => {
    props[name] = decompile(data.value[name])
  })
  return props
}

export const changeIds = (component) => {
  component.identity = makeid()
  component.children.forEach((item) => changeIds(item))
  return component
}

export const dump = (data) => {
  console.log(toJS(data))
}
