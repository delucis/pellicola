#### <sup>:movie_camera: [pellicola](../README.md) → [Documentation](./README.md) → Writing a sketch</sup>

---

## Writing a sketch

When using `pellicola`, a sketch is a function that returns a render function:

```js
const sketch = () => {
  const favouriteColour = '#0f0'
  
  return ({ context, width, height }) => {
    context.fillStyle = favouriteColour
    context.fillRect(width / 4, height / 4, width / 2, height / 2)
  }
}
```

Your sketch function will be called while setting up your animation and the render function you return will be called for each frame we need to generate.


### Variables passed to your render function

The render function that you provide will be called by `pellicola` for each frame of an animation that it needs to generate and it will be passed a series of variables for you to use.

In the example above, we are using the `context`, `width`, and `height` variables to draw to a 2D canvas context and size things proportionally to the canvas’s dimensions. In addition to these variables, there are several we can use to locate ourselves within time in an animation sequence.

For example, the `playhead` variable tells you how far through the total animation duration you are as a number between `0` and `1`:

```js
const sketch = () => {
  return ({ context, width, height, playhead }) => {
    context.fillStyle = 'blue'
    context.fillRect(0, 0, width * playhead, height * playhead)
  }
}
```

At the beginning of the animation, `playhead` is `0` so the rectangle drawn in the sketch function above will have a width and height of `0`. Halfway through the animation, `playhead` will be `0.5`, and the rectangle will take up half of the frame’s width and height. By the end of the animation, `playhead` will be `1` and the blue rectangle will take up the entire frame.

The following variables are available to your render function:

variable name | example value | description
-------------:|:--------------|:----------------------------------------------
`canvas`      |               | An object representing the `<canvas>` element
`context`     |               | Context returned by `canvas.getContext('2d')`
`width`       | `640`         | Width of the canvas in pixels
`height`      | `480`         | Height of the canvas in pixels
`time`        | `2.5`         | Current elapsed time in seconds
`frame`       | `60`          | Current frame number in the animation sequence
`playhead`    | `0.25`        | Progress as a fraction between `0` and `1`
`deltaTime`   | `0.041666`    | Time elapsed since last frame in seconds
`duration`    | `10`          | Duration of the entire animation in seconds
`totalFrames` | `240`         | Total number of frames in the entire animation
`fps`         | `24`          | Number of frames per second in the animation


### Asynchronous sketches

Both your sketch function and the render function it returns can be asynchronous if needed:

```js
const axios = require('axios') // use Axios for network requests
const getRandomColour = async () => {
  // get a random colour from a JSON API
  const { data } = await axios.get('http://www.colr.org/json/color/random')
  return '#' + data.new_color
}

const sketch = async () => {
  // You can get some asynchronous data before returning your render function
  const randomColourForAnimation = await getRandomColour()
  
  return async ({ context, width, height }) => {
    context.fillStyle = randomColourForAnimation
    context.fillRect(0, 0, width, height)
    
    // And you can also get some asynchronous data within your render function 
    // if you need frame-specific data
    const randomColourForEveryFrame = await getRandomColour()
    context.fillStyle = randomColourForEveryFrame
    context.fillRect(width / 4, height / 4, width / 2, height / 2)
  }
}
```


### Saving your sketch in a separate file

Often it’s helpful to break up your work into multiple files so that they don’t become overwhelming. To do that, you can use the `module.exports` syntax to expose your function and use it from a different file:

```js
// sketches/display-text.js
module.exports = () => ({ context, width, height }) => {
  context.fillStyle = 'white'
  context.fillText(
    'My sketch is in “sketches/display-text.js”!',
    width / 2,
    height / 2
  )
}
```

Now we can require your sketch function and use it elsewhere:

```js
// index.js
const pellicola = require('pellicola')
const mySketch = require('./sketches/display-text.js')

pellicola(mySketch, { duration: 5 })
```

---

Now that you have a sketch function, you might like to read [Generating video files](./generating-video-files.md).

#### <sup>[← Back to Documentation](./README.md)
