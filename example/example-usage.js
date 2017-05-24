'use strict'

const pon = require('pon')
const env = require('pon-task-env')

async function tryExample () {
  let run = pon({
    'production:env': env('production'),
    'production:debug': env('development', { DEBUG: 'sg:*' }), // Change env variables other than NODE_ENV
    'production:compile': () => { /* ... */ }
  })

  run('production:env', 'production:compile')
}

tryExample()
