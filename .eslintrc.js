const _ = require('lodash')
const config = require('@freenit-framework/cli')

module.exports = _.merge(config.eslint, {})
