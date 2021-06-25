const _ = require('lodash')
const HtmlPlugin = require('html-webpack-plugin')
const freenitConfig = require('@freenit-framework/cli')

const config = freenitConfig.webpack(__dirname)

config.plugins.push(
  new HtmlPlugin({ favicon: 'favicon.ico', template: 'index.html' })
)

if (process.env.STAGE === 'build') {
  config.optimization = {
    usedExports: true,
    removeAvailableModules: false,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    flagIncludedChunks: true,
    sideEffects: true,
    providedExports: true,
    usedExports: true,
    innerGraph: true,
    mangleExports: true,
    concatenateModules: true,
    runtimeChunk: false,
    emitOnErrors: false,
    checkWasmTypes: true,
    mangleWasmImports: false,
    realContentHash: true,
    minimize: true,
  }
}

module.exports = config
