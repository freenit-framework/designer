const _ = require('lodash')
const path = require('path')
const config = require('@freenit-framework/cli')

const myconfig = {
  context: path.resolve(__dirname, 'src'),
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
  },
}

const target = process.env.BACKEND_URL
if (target) {
  myconfig.devServer.proxy = {
    '/api': { target },
  }
}

const webpackConfig = _.merge(config.webpack, myconfig)

module.exports = webpackConfig
