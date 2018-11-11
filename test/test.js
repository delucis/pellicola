import ava from 'ava'
import ninos from 'ninos'
import fs from 'fs'
import path from 'path'
import { directory } from 'tempy'
import m from '../lib/pellicola'

const test = ninos(ava)

const emptySketch = () => () => {}

const cb = (sketch, opts, test) => m(sketch, Object.assign({ silent: true }, opts))
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

test.cb('can render frames in parallel', test => {
  cb(emptySketch, { renderInParallel: true, duration: 0.5, outDir: directory() }, test)
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
  await test.throws(m(emptySketch, { silent: true }), TypeError)
})

test('FrameMaker throws if provided an invalid frame format', async test => {
  await test.throws(
    m(emptySketch, { duration: 0.25, frameFormat: 'bmp', silent: true }),
    RangeError
  )
})

test('FrameMaker throws if provided an unuseable sketch argument', async test => {
  await test.throws(
    m(() => 'i am a function but i return a string :-(', { duration: 0.25, silent: true }),
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
  const spy = test.context.spy(console, 'warn', () => {})
  await m(emptySketch, { duration: 1, totalFrames: 12, outDir: directory(), silent: true })
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
  m(emptySketch, { filename, totalFrames: 6, outDir: directory(), silent: true })
    .then(src => {
      test.is(path.basename(src), filename)
      fs.readFile(src, test.end)
    })
})

test.cb('can use a custom framerate', test => {
  cb(emptySketch, { fps: 12, totalFrames: 6, outDir: directory() }, test)
})

test('exposes image-loading methods to render function', async test => {
  test.plan(3)
  const sketch = () => ({ Image, ImageData, loadImage }) => {
    test.is(typeof Image, 'function')
    test.is(typeof ImageData, 'function')
    test.is(typeof loadImage, 'function')
  }
  await m(sketch, { totalFrames: 1, outDir: directory(), silent: true })
})

test.cb('a render function can load an image', test => {
  const sketch = () => ({ context, Image }) => {
    const img = new Image()
    img.onload = () => context.drawImage(img, 0, 0)
    img.src = 'test/test.png'
  }
  cb(sketch, { totalFrames: 1, outDir: directory() }, test)
})

test('throws if render function throws an error', async test => {
  const message = 'Failing render function'
  const sketch = () => () => { throw new Error(message) }
  const error = await test.throws(m(sketch, { duration: 1 }))
  test.is(error.message, message)
})

test.cb('can show spinners to monitor progress', test => {
  cb(emptySketch, { totalFrames: 1, outDir: directory(), silent: false }, test)
})
