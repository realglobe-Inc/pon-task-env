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
    const ctx = ponContext()
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
    const ctx = ponContext()
    const task = define.dynamic(() => {
      function foo () {
        console.log('This is the foo')
      }

      foo.bar = () => console.log('this is the bar')
      return foo
    }, {sub: 'bar'})
    ok(task)
    await task(ctx)
    await task.bar(ctx)
  })

  it('Skip', async () => {
    const ctx = ponContext()
    const task = function task () { console.log('Do main task.') }
    task.subTask = function subTask () { console.log('Do sub task.') }
    const skipForTest = define.skipFor('test', task)

    const {NODE_ENV} = process.env

    process.env.NODE_ENV = 'test'

    skipForTest(ctx)
    skipForTest.subTask(ctx)

    process.env.NODE_ENV = NODE_ENV
  })
})

/* global describe, before, after, it */
