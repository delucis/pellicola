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
