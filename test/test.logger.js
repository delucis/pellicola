const test = require('ava')
const logger = require('../lib/logger')

test('it can return an ora stub', t => {
  const silentOra = logger({ silent: true })
  t.is(typeof silentOra, 'function')
  t.is(typeof silentOra.promise, 'function')
  const instance = silentOra()
  t.is(typeof instance.start, 'function')
  t.is(typeof instance.stop, 'function')
  t.is(typeof instance.succeed, 'function')
  t.is(typeof instance.fail, 'function')
})

test('it can return ora unmodified', t => {
  const ora = logger()
  t.is(typeof ora, 'function')
  t.is(typeof ora.promise, 'function')
  const instance = ora()
  t.is(typeof instance.start, 'function')
  t.is(typeof instance.stop, 'function')
  t.is(typeof instance.succeed, 'function')
  t.is(typeof instance.fail, 'function')
})
