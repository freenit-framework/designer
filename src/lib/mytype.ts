const mytype = (o: any) => {
  const t = typeof o
  if (t === 'object') {
    if (o['toHex']) {
      return 'color'
    }
  }
  return t
}

export default mytype
