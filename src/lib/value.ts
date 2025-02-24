class Value {
  private _value: number | string | boolean | null = null

  get value() {
    return this._value
  }
  set value(v) {
    this._value = v
  }

  get mytype() {
    let ret = typeof this._value
    if (ret === 'string' && this._value && this._value.length > 0 && this._value[0] === '#') {
      return 'color'
    }
    return ret
  }
}
