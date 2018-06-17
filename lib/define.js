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
const {isDevelopment, isProduction, isTest} = require('asenv')

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

Object.assign(define, {
  /**
   * Define task to throws error when env matches
   * @function notFor
   * @param {string} nodeEnv
   * @returns {task}
   */
  notFor (nodeEnv) {
    async function task (ctx) {
      const {NODE_ENV} = process.env
      const hit = String(NODE_ENV).trim() === String(nodeEnv).trim()
      if (hit) {
        throw new Error(`[env] This task is not for "${nodeEnv}"`)
      }
      return true
    }

    return task
  },

  /**
   * Define task to skip when env matches
   * @function skipFor
   * @param {string} nodeEnv
   * @param {function} task
   * @returns {task}
   */
  skipFor (nodeEnv, task) {
    const skip = () => {}
    const wrapBySkipTask = (task) => (ctx) => {
      const {NODE_ENV} = process.env
      const hit = String(NODE_ENV).trim() === String(nodeEnv).trim()
      if (hit) {
        const {logger} = ctx
        logger.debug(`Task "${task.name}" is skipped; for NODE_ENV = ${NODE_ENV}`)
      } else {
        return task(ctx)
      }
    }
    const wrapped = wrapBySkipTask(task)
    for (const sub of Object.keys(task)) {
      wrapped[sub] = wrapBySkipTask(task[sub])
    }
    return wrapped
  },

  /**
   * Define dynamic tasks
   * @param {function} taskCreator = task creator function
   * @param {Object} [options={}] - Optional settings
   * @returns {function}
   */
  dynamic (taskCreator, options = {}) {
    const {sub = []} = options

    const create = () => {
      const {NODE_ENV} = process.env
      return taskCreator({
        NODE_ENV,
        isDevelopment,
        isProduction,
        isTest,
      })
    }

    async function dynamicTask (ctx) {
      const task = create()
      return task(ctx)
    }

    Object.assign(dynamicTask,
      ...[].concat(sub).map((sub) => ({
        [sub]: async function dynamicSubTask (ctx) {
          const subTask = create()[sub]
          if (!subTask) {
            throw new Error(`[pon-task-env] Sub task "${sub}" is not found`)
          }
          return subTask(ctx)
        }
      }))
    )

    return dynamicTask
  }
})

module.exports = define
