/**
 * Define task
 * @function define
 * @param {string} nodeEnv - NODE_ENV to set
 * @param {Object} otherEnv - Other env vriables
 * @param {Object} [options={}] - Optional settings
 * @returns {function} Defined task
 */
'use strict'

const argx = require('argx')

const LINE = '========================================='

/** @lends define */
function define (nodeEnv, otherEnv, options = {}) {
  const args = argx(arguments)
  nodeEnv = args.shift('string')
  otherEnv = args.shift('object')

  const values = Object.assign({}, otherEnv, {NODE_ENV: nodeEnv})

  async function task (ctx) {
    const {logger} = ctx
    const namesToChange = Object.keys(values)
      .filter((name) => values[name] !== process.env[name])
    if (namesToChange.length === 0) {
      return
    }
    console.log('')
    logger.notice(LINE)
    for (const name of namesToChange) {
      let from = process.env[name]
      let to = values[name]
      let shouldSkip = from === to
      if (shouldSkip) {
        continue
      }
      process.env[name] = to
      logger.notice(` ${name}: "${from}" -> "${to}"`)
    }
    logger.notice(LINE)
    console.log('')
  }

  return Object.assign(task,
    // Define sub tasks here
    {}
  )
}

module.exports = define
