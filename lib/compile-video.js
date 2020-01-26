const { spawn } = require('child_process')
const { join } = require('path')
const validate = require('aproba')
const { promise: mkdir } = require('mkdirp2')
const ffmpegPath = require('ffmpeg-static')
const { defaultFrameRate, defaultFrameFormat } = require('./constants')

module.exports = compileVideo
/**
 * Compile images to a video
 * @param   {String}  frameDir  Path to the directory containing frame images
 * @param   {String}  outDir    Path to write the output video to
 * @param   {String}  [filename='out.mp4']  Filename of output video
 * @param   {Number}  [fps=defaultFrameRate]  Framerate of output video
 * @param   {String}  frameFormat Image format used for frames (png or jpeg)
 * @param   {Number}  initialFrame Frame number the sequence starts on
 * @return  {Promise<String>}   Returns the path to the saved video file
 */
async function compileVideo (
  frameDir,
  {
    outDir = process.cwd(),
    filename = 'out.mp4',
    fps = defaultFrameRate,
    frameFormat = defaultFrameFormat,
    startFrame
  }
) {
  validate('S|SO', arguments)
  validate('SSNS', [outDir, filename, fps, frameFormat])

  const framesPath = join(frameDir, `%d.${frameFormat}`)

  await mkdir(outDir)

  return new Promise((resolve, reject) => {
    // spawn a child process and use ffmpeg to compile frames to video file
    const ffmpeg = spawn(ffmpegPath, [
      '-v', 'warning',
      '-y', // overwrite files without asking
      '-framerate', fps,
      '-start_number', startFrame, // start compiling from …00.png
      '-i', framesPath, // pattern matching generated frames’ paths
      '-c:v', 'libx264',
      '-vf', `fps=${fps},format=yuv420p`,
      filename
    ], {
      cwd: outDir,
      stdio: 'inherit'
    })

    ffmpeg.on('error', err => {
      reject(err)
    })

    ffmpeg.on('close', code => {
      if (code !== 0) {
        reject(new Error(`ffmpeg exited with the non-zero code of ${code}`))
      }
      resolve(join(outDir, filename))
    })
  })
}
