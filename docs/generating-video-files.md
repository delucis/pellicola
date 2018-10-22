#### <sup>:movie_camera: [pellicule](../README.md) → [Documentation](./README.md) → Generating video files</sup>

---

## Generating video files

Once you have a sketch function up and running (see [‘Writing a sketch’](./writing-a-sketch.md)), you can use it with `pellicule` to get your canvas-based animation out of the browser and into a video file. In this example, we save our video to a `videos` directory relative to where we are currently working and name it `my-sketch.mp4`:

```js
const pellicule = require('pellicule')
const sketch = require('./my-sketch.js') // file that exports a sketch function

pellicule(sketch, {
  duration: 1,
  outDir: 'videos',
  filename: 'my-sketch.mp4'
})
  .then(path => {
    console.log('Video saved at:', path)
  })
```

By default, `pellicule` would save the video as `out.mp4` in the current working directory.

`pellicule` returns a `Promise` for the video’s path once it has been saved, so it can be used either with the `.then()` syntax shown above or using `await` in asynchronous functions. For example we might want to generate our video at several different lengths:

```js
const durations = [1, 5, 10]

durations.forEach(async duration => {
  const path = await pellicule(sketch, {
    duration,
    filename: `sketch-${duration}s.mp4`
  })
  console.log(`${duration}s video saved at: ${path}`)
})
```

---

#### <sup>[← Back to Documentation](./README.md)
