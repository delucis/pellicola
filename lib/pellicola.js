// This is the main entry point for this package
// We will need functionality from some useful external libraries:
const validate = require('aproba')
const { default: PQueue } = require('p-queue')
const del = require('del')
// We also need functionality that we’ve broken up into other files:
const logger = require('./logger')
const FrameMaker = require('./frame-maker')
const FrameWriter = require('./frame-writer')
const compileVideo = require('./compile-video')
const { defaultFrameRate, defaultFrameFormat, possibleFrameFormats } = require('./constants')

// pellicola exports a single function that will run the animation generator
module.exports = pellicola
/**
 * Generate a video from a Javascript <canvas> animation sketch
 * @param  {Function} sketch                         Renders to <canvas>
 * @param  {Number} [fps=defaultFrameRate]           Frames per second
 * @param  {String} [frameFormat=defaultFrameFormat] Frame format, e.g. 'png'
 * @param  {Object[]} fonts                          Custom fonts to register
 * @param  {Number[]} dimensions                     [width, height] in pixels
 * @param  {Number} duration                         Animation length in seconds
 * @param  {Number} totalFrames                      Animation length in frames
 * @param  {Number} [time=0]                         Start time in seconds
 * @param  {Number} [frame=0]                        Initial frame number
 * @param  {Number} endTime                          Time to stop rendering at
 * @param  {Number} endFrame                         Last frame number to render
 * @param  {String} outDir                           Directory to write video to
 * @param  {String} filename                         Output video file name
 * @param  {Boolean}  renderInParallel               Render frames in parallel
 * @param  {Number} maxConcurrency                   Number of parallel frames
 * @param  {Boolean}  [silent=false]                 Suppress progress spinners
 * @param  {Object} motionBlur                       Configure motion blur
 * @param  {Boolean} [cleanup=true]                  Enable/disable cleanup
 * @return {Promise<String>}  Returns the path to the saved video file
 */
async function pellicola (
  sketch,
  {
    fps = defaultFrameRate,
    frameFormat = defaultFrameFormat,
    fonts,
    dimensions,
    duration,
    totalFrames,
    time = 0,
    frame = 0,
    endTime,
    endFrame,
    outDir,
    filename,
    renderInParallel = false,
    maxConcurrency = 16,
    silent = false,
    motionBlur,
    cleanup = true
  }
) {
  validate('FO', arguments)

  // Create an ora logger that won’t output if silent === true
  const ora = logger({ silent })

  // Make sure we have a way to calculate video length and that duration and
  // frame counts are consistent
  if (!duration && !totalFrames) {
    throw new TypeError('You must provide either a duration or totalFrames property in the options object')
  }
  if (duration && !totalFrames) {
    totalFrames = Math.round(duration * fps)
  } else if (duration && Math.round(duration * fps) !== totalFrames) {
    console.warn(`Warning: You are providing both a duration option (${duration}s) and a totalFrames option (${totalFrames} frames).\n` + `Duration will be used to override the total number of frames.`)
    totalFrames = Math.round(duration * fps)
  }

  // Make sure we have a valid initial frame number
  let startFrame = frame
  if (time && !frame) {
    startFrame = Math.round(time * fps)
  } else if (time && Math.round(time * fps) !== frame) {
    console.warn(`Warning: You are providing both a time option (${time}s) and a frame option (${frame} frames).\n` + `Time will be used to override the initial frame.`)
    startFrame = Math.round(time * fps)
  }

  // Make sure there are some frames to render
  if (totalFrames - startFrame < 1) {
    throw new Error(`No frames to render! Try increasing the “duration” or “totalFrames” options`)
  }

  if (!endTime && !endFrame) {
    endFrame = totalFrames
  } else if (endTime && !endFrame) {
    endFrame = Math.round(endTime * fps)
  } else if (endTime && Math.round(endTime * fps) !== endFrame) {
    console.warn(`Warning: You are providing both an endTime option (${endTime}s) and an endFrame option (${endFrame} frames).\n` + `endTime will be used to override the final frame.`)
    endFrame = Math.round(endTime * fps)
  }

  if (endFrame > totalFrames) {
    console.warn(`Warning: You are specifying an endFrame (${endFrame}) that is beyond the end of the specified sketch duration (${totalFrames} frames). Output will be truncated.`)
    endFrame = totalFrames
  }

  // Make sure the frame format argument is valid
  if (!possibleFrameFormats.includes(frameFormat)) {
    throw new RangeError(`frameFormat must be “png” or “jpeg”, got “${frameFormat}”`)
  }

  // Initialise our frame maker and writer instances
  const maker = await FrameMaker(sketch, { fonts, dimensions, fps, totalFrames, startFrame, endFrame, frameFormat, renderInParallel, motionBlur })
  const writer = FrameWriter(frameFormat)

  // Adjust totalFrames by initial frame offset
  const framesToRender = endFrame - startFrame

  // Get a terminal spinner to display frame rendering progress
  const progress = ora('Rendering frames')
  progress.update = function updateProgress () {
    progress.done ? progress.done++ : progress.done = 1
    progress.text = `Rendering frames (${progress.done}/${framesToRender})`
  }
  progress.start()

  // Run the frame maker for every frame and write the results to disk
  const queue = new PQueue({ concurrency: renderInParallel ? maxConcurrency : 1 })
  await queue.addAll(new Array(framesToRender)
    .fill()
    .map((_, number) => async () => {
      try {
        // Wait to get a frame buffer, then send it to be written to disk
        const frameNumber = startFrame + number
        const buffer = await maker.getFrame(frameNumber)
        writer.write(buffer, frameNumber)
        progress.update()
      } catch (error) {
        queue.pause()
        if (progress.isSpinning) progress.fail()
        throw error
      }
    }))
  progress.succeed()

  // Wait for all the write operations to finish
  const writeFrames = writer.done()
  ora.promise(writeFrames, 'Writing frames to disk')
  await writeFrames

  const writeVideo = compileVideo(writer.getDir(), { outDir, filename, fps, frameFormat, startFrame })
  ora.promise(writeVideo, 'Compiling video')
  const writePath = await writeVideo

  if (cleanup) {
    const cleaner = del(writer.getDir(), { force: true })
    ora.promise(cleaner, 'Cleaning up temporary files')
    await cleaner
  }

  return writePath
}
