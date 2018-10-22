// This is the main entry point for this package
// We will need functionality from some useful external libraries:
const validate = require('aproba')
// We also need functionality that we’ve broken up into other files:
const FrameMaker = require('./frame-maker')
const FrameWriter = require('./frame-writer')
const compileVideo = require('./compile-video')
const { defaultFrameRate, defaultFrameFormat } = require('./constants')

// pellicule exports a single function that will run the animation generator
module.exports = pellicule
/**
 * Generate a video from a Javascript <canvas> animation sketch
 * @param  {Function} sketch                         Renders to <canvas>
 * @param  {Number} [fps=defaultFrameRate]           Frames per second
 * @param  {String} [frameFormat=defaultFrameFormat] Frame format, e.g. 'png'
 * @param  {Object[]} fonts                          Custom fonts to register
 * @param  {Number[]} dimensions                     [width, height] in pixels
 * @param  {Number} duration                         Animation length in seconds
 * @param  {Number} totalFrames                      Animation length in frames
 * @param  {String} outDir                           Directory to write video to
 * @param  {String} filename                         Output video file name
 * @return {Promise<String>}  Returns the path to the saved video file
 */
async function pellicule (
  sketch,
  {
    fps = defaultFrameRate,
    frameFormat = defaultFrameFormat,
    fonts,
    dimensions,
    duration,
    totalFrames,
    outDir,
    filename
  } = {}
) {
  validate('F|FO', arguments)

  // Make sure we have a way to calculate video length and that duration and
  // frame counts are consistent
  if (!duration && !totalFrames) {
    throw new TypeError('You must provide either a duration or totalFrames property in the options object')
  }
  if (duration && !totalFrames) {
    totalFrames = duration * fps
  } else if (duration && duration * fps !== totalFrames) {
    console.warn(`Warning: You are providing both a duration option (${duration}s) and a totalFrames option (${totalFrames} frames).\n` + `Duration will be used to override the total number of frames.`)
    totalFrames = duration * fps
  }

  // Initialise our frame maker and writer instances
  const maker = FrameMaker(sketch, { fonts, dimensions, fps, totalFrames, frameFormat })
  const writer = FrameWriter()

  // Run the frame maker for every frame and write the results to disk
  await Promise.all(new Array(totalFrames).fill().map(async (_, frame) => {
    const buffer = await maker.getFrame(frame)
    writer.write(buffer, frame, { format: frameFormat })
  }))

  // Wait for all the write operations to finish
  await writer.done()

  return compileVideo(writer.getDir(), { outDir, filename, fps, frameFormat })
}
