import ava from 'ava'
import ninos from 'ninos'
import fs from 'fs'
import path from 'path'
import { directory } from 'tempy'
import m from '../lib/pellicola'

const test = ninos(ava)

const emptySketch = () => () => {}

const cb = (sketch, opts, test) => m(sketch, opts)
  .then(src => fs.readFile(src, test.end))

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

  cb(sketch, { duration: 1, outDir: directory() }, test)
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

  cb(sketch, { duration: 0.25, outDir: directory(), fonts }, test)
})

test('throws if provided neither totalFrames nor duration', async test => {
  await test.throws(m(emptySketch), TypeError)
})

test('FrameMaker throws if provided an invalid frame format', async test => {
  await test.throws(
    m(emptySketch, { duration: 0.25, frameFormat: 'bmp' }),
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
  cb(sketch, { duration: 0.25, outDir: directory() }, test)
})

test('non-matching duration & totalFrames should raise a warning', async test => {
  const spy = test.context.spy(console, 'warn')
  await m(emptySketch, { duration: 1, totalFrames: 12, outDir: directory() })
  test.is(spy.calls.length, 1)
})

test.cb('duration can be set using totalFrames option', test => {
  cb(emptySketch, { totalFrames: 6, outDir: directory() }, test)
})

test.cb('can write frames as JPEGs', test => {
  cb(emptySketch, { frameFormat: 'jpeg', totalFrames: 6, outDir: directory() }, test)
})

test.cb('can set a custom filename', test => {
  const filename = 'custom-name.mp4'
  m(emptySketch, { filename, totalFrames: 6, outDir: directory() })
    .then(src => {
      test.is(path.basename(src), filename)
      fs.readFile(src, test.end)
    })
})
