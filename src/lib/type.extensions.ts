// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface String {
  vtype(): string
}

String.prototype.vtype = function () {
  return 'string'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Number {
  vtype(): string
}

Number.prototype.vtype = function () {
  return 'number'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Boolean {
  vtype(): string
}

Boolean.prototype.vtype = function () {
  return 'boolean'
}
