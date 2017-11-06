/**
 * Test case for define.
 * Runs with mocha.
 */
'use strict'

const define = require('../lib/define.js')
const ponContext = require('pon-context')
const {ok, equal} = require('assert')

describe('define', function () {
  this.timeout(3000)

  before(async () => {

  })

  after(async () => {

  })

  it('Define', async () => {
    let ctx = ponContext()
    let {NODE_ENV} = process.env
    process.env.NODE_ENV = 'foo'
    process.env.BAZ = 'this is baz'
    let task = define('bar', {HOGE: 'FUGE', BAZ: 'this is baz'})
    ok(task)

    await Promise.resolve(task(ctx))
    equal(process.env.NODE_ENV, 'bar')
    equal(process.env.HOGE, 'FUGE')

    await Promise.resolve(task(ctx))

    {
      const notFor = define.notFor('bar')
      const e = await notFor(ctx).catch((e) => e)
      ok(e.message)
    }

    process.env.NODE_ENV = NODE_ENV
  })

  it('Dynamic', async () => {
    const task = define.dynamic(() => function tak () {
      console.log('This is the task')
    })
    ok(task)
  })
})

/* global describe, before, after, it */
