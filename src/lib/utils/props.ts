export function isSimple(data: any): boolean {
  if ([undefined, null].includes(data)) {
    return false
  }
  const simple = ['number', 'boolean', 'string', 'color']
  if (data.value && data.type) {
    return simple.includes(data.type)
  }
  return simple.includes(typeof data)
}

export function isObject(data: any): boolean {
  if ([undefined, null].includes(data)) {
    return false
  }
  if (Array.isArray(data.value)) return false
  return true
}

export const compile = (value: any) => {
  const result: Record<any, any> = {}
  if (isSimple(value)) {
    result.value = value
    result.type = typeof value
  } else if (Array.isArray(value)) {
    result.value = value.map((v) => compile(v))
  } else {
    result.value = {}
    for (const name in value) {
      result.value[name] = compile(value[name])
    }
  }
  return result
}

export const decompile = (data: Record<any, any>) => {
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
