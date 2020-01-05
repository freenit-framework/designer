const proxy = require('http-proxy-middleware')
const target = process.env.BACKEND_URL

module.exports = function(app) {
  if (target) {
    app.use(proxy('/api', { target }))
    app.use(proxy('/media', { target }))
  }
}
