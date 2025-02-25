export default class Color {
  r = 0
  g = 0
  b = 0
  a = 0

  constructor(r, g, b, a) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }

  toString = () => {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
  }

  vtype = () => 'color'
}
