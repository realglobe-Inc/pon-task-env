/**
 * Define task
 * @function define
 * @param {string} env - NODE_ENV to set
 * @param {Object} [options={}] - Optional settings
 * @returns {function} Defined task
 */
'use strict'

const co = require('co')

const LINE = '========================================='

/** @lends define */
function define (env, options = {}) {
  function task (ctx) {
    const { logger } = ctx
    return co(function * () {
      let noNeed = env === process.env.NODE_ENV
      if (noNeed) {
        return
      }
      let from = process.env.NODE_ENV
      process.env.NODE_ENV = env
      console.log('')
      logger.notice(LINE)
      logger.notice(` NODE_ENV changed "${from}" -> "${env}"`)
      logger.notice(LINE)
      console.log('')
    })
  }

  return Object.assign(task,
    // Define sub tasks here
    {}
  )
}

module.exports = define
