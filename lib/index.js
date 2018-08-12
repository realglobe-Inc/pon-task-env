/**
 * Pon task to set NODE_ENV
 * @module pon-task-env
 * @version 1.3.6
 */

'use strict'

const define = require('./define')

const lib = define.bind(this)

Object.assign(lib, define, {
  define
})

module.exports = lib
