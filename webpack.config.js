const _ = require('lodash')
const HtmlPlugin = require('html-webpack-plugin')
const freenitConfig = require('@freenit-framework/cli')

const config = freenitConfig.webpack(__dirname)

config.plugins.push(
  new HtmlPlugin({ favicon: 'favicon.ico', template: 'index.html' })
)

config.optimization = {
  minimize: true,
  removeAvailableModules: true,
  flagIncludedChunks: true,
  providedExports: true,
  usedExports: true,
}

const target = process.env.BACKEND_URL
if (target) {
  config.devServer.proxy = {
    '/api': { target },
  }
}

module.exports = config
