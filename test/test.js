import ava from 'ava'
import ninos from 'ninos'
import fs from 'fs'
import { directory } from 'tempy'
import m from '../lib/pellicola'

const test = ninos(ava)

test('imports module', test => {
  test.is(typeof m, 'function')
})

test.cb('generates a video', test => {
  const sketch = () => ({ context: ctx, height, width, playhead }) => {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width * playhead, height)
  }

  m(sketch, { duration: 1, outDir: directory() })
    .then(src => fs.readFile(src, test.end))
})

test.cb('can load custom fonts', test => {
  const fonts = [
    { family: 'testFont', path: 'test/test-regular.ttf' },
    { family: 'testFont', weight: 'bold', path: 'test/test-bold.ttf' }
  ]

  const sketch = () => ({ context: ctx, height, width }) => {
    ctx.fillStyle = '#fff'
    ctx.font = '400 36px testFont'
    ctx.fillText('Regular text', 0, 36)
    ctx.font = '700 24px testFont'
    ctx.fillText('Smaller bold text', 0, 100)
  }

  m(sketch, { duration: 0.25, outDir: directory(), fonts })
    .then(src => fs.readFile(src, test.end))
})

test('throws if provided neither totalFrames nor duration', async test => {
  const sketch = () => () => {}
  await test.throws(m(sketch), TypeError)
})

test('FrameMaker throws if provided an invalid frame format', async test => {
  const sketch = () => () => {}
  await test.throws(
    m(sketch, { duration: 0.25, frameFormat: 'bmp' }),
    RangeError
  )
})

test('FrameMaker throws if provided an unuseable sketch argument', async test => {
  await test.throws(
    m(() => 'i am a function but i return a string :-(', { duration: 0.25 }),
    TypeError
  )
})

test.cb('FrameMaker can use a sketch that returns an object', test => {
  const sketch = () => ({
    render: () => {}
  })
  m(sketch, { duration: 0.25, outDir: directory() })
    .then(src => fs.readFile(src, test.end))
})

test('non-matching duration & totalFrames should raise a warning', async test => {
  const spy = test.context.spy(console, 'warn')
  const sketch = () => () => {}
  await m(sketch, { duration: 1, totalFrames: 12, outDir: directory() })
  test.is(spy.calls.length, 1)
})

test.cb('duration can be set using totalFrames option', test => {
  const sketch = () => () => {}
  m(sketch, { totalFrames: 6, outDir: directory() })
    .then(src => fs.readFile(src, test.end))
})

test.cb('can write frames as JPEGs', test => {
  const sketch = () => () => {}
  m(sketch, { frameFormat: 'jpeg', totalFrames: 6, outDir: directory() })
    .then(src => fs.readFile(src, test.end))
})
