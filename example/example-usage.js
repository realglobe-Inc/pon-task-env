'use strict'

const pon = require('pon')
const ponTaskEnv = require('pon-task-env')

async function tryExample () {
  let run = pon({
    'production:env': ponTaskEnv('production'),
    'production:compile': () => { /* ... */ }
  })

  run('production:env', 'production:compile')
}

tryExample()
