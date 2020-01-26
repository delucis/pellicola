const ava = require('ava')
const ninos = require('ninos')
const fs = require('fs')
const path = require('path')
const tempy = require('tempy')
const m = require('../lib/pellicola')

const test = ninos(ava)
const { directory } = tempy

const emptySketch = () => () => {}

const cb = (sketch, opts, test) => m(sketch, { silent: true, ...opts })
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

test.cb('can render with a time offset', test => {
  cb(emptySketch, { duration: 1, time: 0.5, outDir: directory() }, test)
})

test.cb('can render with a frame offset', test => {
  cb(emptySketch, { duration: 1, frame: 5, outDir: directory() }, test)
})

test('rendering with an offset provides correct context variables', async test => {
  const sketch = () => ({ duration, totalFrames, playhead, frame }) => {
    test.log({ duration, totalFrames, playhead, frame })
    test.is(playhead, 1)
    test.is(frame, 47)
    test.is(duration, 2)
    test.is(totalFrames, 48)
  }
  await m(sketch, { duration: 2, frame: 47, outDir: directory(), silent: true })
})

test.cb('can render with a frame truncation', test => {
  cb(emptySketch, { duration: 1, endFrame: 12, outDir: directory() }, test)
})

test.cb('can render with a time truncation', test => {
  cb(emptySketch, { duration: 1, endTime: 0.5, outDir: directory() }, test)
})

test('can render a portion of a sketch', async test => {
  let count = 0
  const sketch = () => () => { count++ }
  await m(sketch, { duration: 2, time: 0.5, endTime: 1.5, outDir: directory() })
  test.is(count, 24)
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
  await test.throwsAsync(m(emptySketch, { silent: true }), TypeError)
})

test('throws if totalFrames is less than initial frame', async test => {
  await test.throwsAsync(m(emptySketch, { totalFrames: 6, frame: 12, silent: true }))
})

test('FrameMaker throws if provided an invalid frame format', async test => {
  await test.throwsAsync(
    m(emptySketch, { duration: 0.25, frameFormat: 'bmp', silent: true }),
    RangeError
  )
})

test('FrameMaker throws if provided an unuseable sketch argument', async test => {
  await test.throwsAsync(
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

const warningTests = [
  {
    name: 'non-matching duration & totalFrames should raise a warning',
    opts: { duration: 1, totalFrames: 12 }
  },
  {
    name: 'non-matching time & frame should raise a warning',
    opts: { time: 0.7, frame: 7 }
  },
  {
    name: 'non-matching endTime & endFrame should raise a warning',
    opts: { endTime: 0.7, endFrame: 7 }
  },
  {
    name: 'an endFrame beyond the end of the duration should raise a warning',
    opts: { duration: 1, endFrame: 25 }
  }
]

warningTests.forEach(({ name, opts }) => {
  test(name, async test => {
    const spy = test.context.spy(console, 'warn', () => {})
    await m(emptySketch, { duration: 1, outDir: directory(), silent: true, ...opts })
    test.is(spy.calls.length, 1)
  })
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

test('exposes context to sketch function', async test => {
  test.plan(7)
  const sketch = ({ width, height, duration, totalFrames, fps, loadImage, ImageData }) => {
    test.is(typeof width, 'number')
    test.is(typeof height, 'number')
    test.is(typeof duration, 'number')
    test.is(typeof totalFrames, 'number')
    test.is(typeof fps, 'number')
    test.is(typeof ImageData, 'function')
    test.is(typeof loadImage, 'function')
    return () => {}
  }
  await m(sketch, { totalFrames: 1, outDir: directory(), silent: true })
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

test.cb('can render with motion blur', test => {
  cb(emptySketch, { duration: 1, outDir: directory(), motionBlur: { samplesPerFrame: 4 } }, test)
})

test.cb('can render with motion blur and custom shutterAngle', test => {
  cb(emptySketch, { duration: 1, outDir: directory(), motionBlur: { samplesPerFrame: 4, shutterAngle: 2 } }, test)
})

test('throws if render function throws with motion blur rendering', async test => {
  const message = 'Failing render function'
  const sketch = () => () => { throw new Error(message) }
  const error = await test.throwsAsync(m(sketch, { duration: 1, motionBlur: { samplesPerFrame: 4 } }))
  test.is(error.message, message)
})

test('throws if render function throws an error', async test => {
  const message = 'Failing render function'
  const sketch = () => () => { throw new Error(message) }
  const error = await test.throwsAsync(m(sketch, { duration: 1 }))
  test.is(error.message, message)
})

test.cb('can show spinners to monitor progress', test => {
  cb(emptySketch, { totalFrames: 1, outDir: directory(), silent: false }, test)
})

test.cb('can disable temporary file cleanup', test => {
  cb(emptySketch, { totalFrames: 1, outDir: directory(), cleanup: false }, test)
})
