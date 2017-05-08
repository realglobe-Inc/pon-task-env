/**
 * Test case for define.
 * Runs with mocha.
 */
'use strict'

const define = require('../lib/define.js')
const ponContext = require('pon-context')
const { ok } = require('assert')
const co = require('co')

describe('define', function () {
  this.timeout(3000)

  before(() => co(function * () {

  }))

  after(() => co(function * () {

  }))

  it('Define', () => co(function * () {
    let ctx = ponContext()
    let { NODE_ENV } = process.env
    process.env.NODE_ENV = 'foo'
    let task = define('bar', {})
    ok(task)

    yield Promise.resolve(task(ctx))

    process.env.NODE_ENV = NODE_ENV
  }))
})

/* global describe, before, after, it */
