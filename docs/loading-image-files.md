#### <sup>:movie_camera: [pellicola](../README.md) → [Documentation](./README.md) → Loading image files</sup>

---

## Loading image files

To load an image file and draw it to your canvas, you can follow [standard Canvas API methods][mdn] by using the `Image` constructor passed to your render function.

```js
const sketch = () => ({ context, Image }) => {
  // create a new image element
  const img = new Image()
  // create a listener that will draw our image once it is loaded
  img.onload = () => context.drawImage(img, 0, 0)
  // set the image’s source, triggering the file to load
  img.src = 'my-image.png'
}
```

In a browser, the `src` property is always set to a URL, which might be relative, absolute, or a Base64-encoded data URL. Behaviour in `node-canvas` is the same, but in addition you can set `src` to be an image `Buffer` or a local file path (see [`node-canvas` docs][imgsrc]). In the example above, we are loading `my-image.png` from the local disk.

### Alternative loading techniques

#### `loadImage()`

As well as the standard `Image` constructor, `pellicola` exposes `node-canvas`’s `loadImage` method, which can simplify loading images. Using `loadImage` the example above might look like this:

```js
const sketch = () => async ({ context, loadImage }) => {
  // wait for our image to load
  const img = await loadImage('my-image.png')
  // draw the image
  context.drawImage(img, 0, 0)
}
```

### Loading images during sketch set up

Often it would not be ideal to load the same image repeatedly for each frame. You may prefer to load an image once when your sketch function is initialised and re-use it in every frame:

```js
const { readFile } = require('fs')
const { promisify } = require('util')
const read = promisify(readFile)

const sketch = async () => {
  const imageBuffer = await read('my-image.png')
  
  return ({ context, Image }) => {
    const img = new Image()
    img.onload = () => context.drawImage(img, 0, 0)
    img.src = imageBuffer
  }
}
```

Above we are using Node’s built-in file system module `fs`, but you could also decide to use other loaders such as [`load-asset`][la] that will also work in a web browser.

[mdn]: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images
[imgsrc]: https://github.com/Automattic/node-canvas#imagesrc
[la]: https://www.npmjs.com/package/load-asset

---

#### <sup>[← Back to Documentation](./README.md)
