#### <sup>:movie_camera: [pellicola](../README.md) → [Documentation](./README.md) → Generating video files</sup>

---

## Generating video files

Once you have a sketch function up and running (see [‘Writing a sketch’][sketch]), you can use it with `pellicola` to get your canvas-based animation out of the browser and into a video file.

In this example, we save our video to a `videos` directory relative to where we are currently working and name it `my-sketch.mp4`:

```js
const pellicola = require('pellicola')
const sketch = require('./my-sketch.js') // file that exports a sketch function

const settings = {
  duration: 1,
  outDir: 'videos',
  filename: 'my-sketch.mp4'
}

pellicola(sketch, settings)
  .then(path => console.log('Video saved at:', path))
```

By default, `pellicola` would save the video as `out.mp4` in the current working directory.

`pellicola` returns a `Promise` for the video’s path once it has been saved, so it can be used either with the `.then()` syntax shown above or using `await` in asynchronous functions. For example we might want to generate our video at several different lengths:

```js
const durations = [1, 5, 10]

durations.forEach(async duration => {
  const settings = {
    duration,
    filename: `sketch-${duration}s.mp4`
  }
  const path = await pellicola(sketch, settings)
  console.log(`${duration}s video saved at: ${path}`)
})
```

### Possible settings for `pellicola`

The second argument to `pellicola` is an object configuring how your video will be generated. Some of the options impact how your canvas is drawn, while others control how the video is compiled.

All settings are optional, except that you must include one of either `duration` or `totalFrames` to set how long your video will last.

variable      | default      | description
--------------|--------------|------------------------------------------------------
`dimensions`  | `[640, 480]` | Sets `[width, height]` of your video
`duration`    |              | Sets the duration of your video in seconds
`filename`    | `'out.mp4'`  | Sets the filename of your video
`fonts`       |              | An array of custom fonts to load (see [‘Using custom fonts’][fonts])
`fps`         | `24`         | Number of frames per second in the animation
`frameFormat` | `'png'`      | Sets canvas export format: either `'png'` or `'jpeg'`
`outDir`      | `'.'`        | Path to the directory to save your video in
`totalFrames` |              | Sets the duration of your video in frames

[sketch]: ./writing-a-sketch.md
[fonts]: ./using-custom-fonts.md

---

#### <sup>[← Back to Documentation](./README.md)
