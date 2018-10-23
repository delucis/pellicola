const path = require('path')
const validate = require('aproba')
const { registerFont, createCanvas } = require('canvas')

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
 * @param   {Number}    fps               Frames per second
 * @param   {String}    frameFormat       Format to export to: 'png', 'jpeg'
 * @return  {Object}    A FrameMaker instance with a getFrame() method
 */
async function FrameMaker (
  sketch,
  {
    fonts = [],
    dimensions = [640, 480],
    totalFrames,
    fps,
    frameFormat
  }
) {
  validate('FAANNS', [sketch, fonts, dimensions, totalFrames, fps, frameFormat])

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
  const renderer = await sketch()
  let renderFn
  if (typeof renderer === 'function') {
    renderFn = renderer
  } else if (typeof renderer === 'object' && typeof renderer.render === 'function') {
    renderFn = renderer.render
  } else {
    throw new TypeError('Couldn’t get a render function from the provided sketch')
  }

  return {
    /**
     * Get a Buffer representing the image data for a single frame
     * @param  {Number} frame       The current frame number
     * @return {Promise<Buffer>}    Resolves to an image buffer
     */
    getFrame (frame) {
      return new Promise(async (resolve, reject) => {
        const canvas = createCanvas(width, height)
        const context = canvas.getContext('2d')

        const time = frame / fps
        const playhead = frame / (totalFrames - 1)

        await renderFn({ canvas, context, width, height, time, frame, playhead, deltaTime, duration, totalFrames, fps })

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
