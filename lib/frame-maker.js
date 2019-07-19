const path = require('path')
const validate = require('aproba')
const { registerFont, createCanvas, Image, ImageData, loadImage } = require('canvas')

/**
 * Add custom fonts to node-canvas’s environment.
 * @param {Object[]}  fonts An array of objects specifying font defnitions
 * @return {undefined}
 */
function registerCustomFonts (fonts) {
  validate('A', [fonts])
  fonts.forEach(font => {
    registerFont(
      path.resolve(font.path),
      {
        family: font.family,
        weight: font.weight || 'normal',
        style: font.style || 'normal'
      }
    )
  })
}

module.exports = FrameMaker
/**
 * Get a FrameMaker instance that makes getting frames for a sketch easy
 * @param   {Function|Object} sketch    Sketch function
 * @param   {Object[]}  [fonts=[]] Array of objects defining fonts
 * @param   {Number[]}  [dimensions=[640, 480]] Width & height of sketch
 * @param   {Number}    totalFrames       Total number of frames in animation
 * @param   {Number}    startFrame        First frame to render
 * @param   {Number}    endFrame          Last frame to render
 * @param   {Number}    fps               Frames per second
 * @param   {String}    frameFormat       Format to export to: 'png', 'jpeg'
 * @param   {Boolean}   renderInParallel  Set the renderer to run in parallel
 * @param   {Object}    motionBlur        Configure motion blur rendering
 * @return  {Object}    A FrameMaker instance with a getFrame() method
 */
async function FrameMaker (
  sketch,
  {
    fonts = [],
    dimensions = [640, 480],
    totalFrames,
    startFrame,
    endFrame,
    fps,
    frameFormat,
    renderInParallel,
    motionBlur: {
      samplesPerFrame = 1,
      shutterAngle = 1
    } = {}
  }
) {
  validate('FAANNNNSBNN', [sketch, fonts, dimensions, totalFrames, startFrame, endFrame, fps, frameFormat, renderInParallel, samplesPerFrame, shutterAngle])

  // In the browser custom fonts are loaded as normal web fonts, but as we’re
  // avoiding the browser, we need to register non-system fonts for use by
  // node-canvas
  registerCustomFonts(fonts)

  // Provide more helpful variables
  const [width, height] = dimensions
  const deltaTime = 1 / fps
  const duration = totalFrames / fps

  // Following canvas-sketch, a sketch function should either return a function
  // that renders a canvas, or an object with a function as its render property
  const renderer = await sketch(
    { width, height, duration, totalFrames, frame: startFrame, endFrame, fps, loadImage, ImageData }
  )
  let renderFn
  if (typeof renderer === 'function') {
    renderFn = renderer
  } else if (typeof renderer === 'object' && typeof renderer.render === 'function') {
    renderFn = renderer.render
  } else {
    throw new TypeError('Couldn’t get a render function from the provided sketch')
  }

  // Initialise canvas and context
  let rootCanvas, rootContext
  if (!renderInParallel) {
    rootCanvas = createCanvas(width, height)
    rootContext = rootCanvas.getContext('2d')
  }

  /**
   * Draw a frame to the provided canvas and context
   * @param  {Number} frame   The current frame number
   * @param  {Object} canvas  <canvas> instance
   * @param  {Object} context 2D <canvas> context
   * @return {Promise<undefined>} Resolves once drawing is complete
   */
  async function drawFrame (frame, canvas, context) {
    const time = frame / fps
    const playhead = frame / (totalFrames - 1)

    const environment = { canvas, context, width, height, time, frame, playhead, deltaTime, duration, totalFrames, fps, loadImage, Image, ImageData }

    return renderFn(environment)
  }

  /**
   * Draw a frame with motion blur by averaging frames at small time increments
   * @param  {Number} frame   The current frame number
   * @param  {Object} canvas  <canvas> instance
   * @param  {Object} context 2D <canvas> context
   * @return {Promise<undefined>} Resolves once drawing is complete
   */
  async function drawWithMotionBlur (frame, canvas, context) {
    // Make an array to hold our composite values. Filling with a for loop is
    // faster than using `.fill(0)`
    const size = width * height * 4
    const composite = new Array(size)
    for (let i = 0; i < size; i++) { composite[i] = 0 }

    // For every sample, run the render function and add the new pixel values to
    // the composite array
    let imageData
    for (let sample = 0; sample < samplesPerFrame; sample++) {
      const sampleFrame = frame + sample * shutterAngle / samplesPerFrame
      await drawFrame(sampleFrame, canvas, context)
      imageData = context.getImageData(0, 0, width, height)
      for (let idx = 0; idx < imageData.data.length; idx++) {
        composite[idx] += imageData.data[idx]
      }
    }

    // Fill the pixels in `imageData` with averaged values from `composite`
    for (let idx = 0; idx < imageData.data.length; idx++) {
      imageData.data[idx] = composite[idx] / samplesPerFrame
    }

    // Draw the averaged image data to the canvas
    context.putImageData(imageData, 0, 0)
  }

  return {
    /**
     * Get a Buffer representing the image data for a single frame
     * @param  {Number} frame       The current frame number
     * @return {Promise<Buffer>}    Resolves to an image buffer
     */
    async getFrame (frame) {
      let canvas, context
      if (renderInParallel) {
        canvas = createCanvas(width, height)
        context = canvas.getContext('2d')
      } else {
        canvas = rootCanvas
        context = rootContext
      }

      if (samplesPerFrame > 1) {
        await drawWithMotionBlur(frame, canvas, context)
      } else {
        await drawFrame(frame, canvas, context)
      }

      return new Promise((resolve, reject) => {
        canvas.toBuffer(
          function (error, buffer) {
            if (error) reject(error)
            if (buffer) resolve(buffer)
          },
          `image/${frameFormat}`
        )
      })
    }
  }
}
