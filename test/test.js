import test from 'ava'
import fs from 'fs'
import { directory } from 'tempy'
import m from '../lib/pellicola'

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
