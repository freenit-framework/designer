const _ = require('lodash')
const HtmlPlugin = require('html-webpack-plugin')
const freenitConfig = require('@freenit-framework/cli')

const config = freenitConfig.webpack(__dirname)

config.plugins.push(
  new HtmlPlugin({ favicon: 'favicon.ico', template: 'index.html' })
)

if (process.env.STAGE === 'build') {
  config.optimization = {
    minimize: true,
    sideEffects: true,
    usedExports: true,
  }
}

module.exports = config
