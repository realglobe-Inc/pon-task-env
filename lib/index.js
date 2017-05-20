/**
 * Pon task to set NODE_ENV
 * @module pon-task-env
 * @version 1.0.1
 */

'use strict'

const define = require('./define')

let lib = define.bind(this)

Object.assign(lib, define, {
  define
})

module.exports = lib
