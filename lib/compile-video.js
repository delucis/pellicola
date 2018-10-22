const { spawn } = require('child_process')
const { join } = require('path')
const validate = require('aproba')
const { defaultFrameRate, defaultFrameFormat } = require('./constants')

module.exports = compileVideo
/**
 * Compile images to a video
 * @param   {String}  frameDir  Path to the directory containing frame images
 * @param   {String}  outDir    Path to write the output video to
 * @param   {String}  [filename='out.mp4']  Filename of output video
 * @param   {Number}  [fps=defaultFrameRate]  Framerate of output video
 * @param   {String}  frameFormat Image format used for frames (png or jpeg)
 * @return  {Promise<String>}   Returns the path to the saved video file
 */
function compileVideo (
  frameDir,
  {
    outDir = process.cwd(),
    filename = 'out.mp4',
    fps = defaultFrameRate,
    frameFormat = defaultFrameFormat
  }
) {
  validate('S|SO', arguments)
  validate('SSNS', [outDir, filename, fps, frameFormat])

  return new Promise((resolve, reject) => {
    const framesPath = join(frameDir, `%d.${frameFormat}`)

    // spawn a child process and use ffmpeg to compile frames to video file
    const ffmpeg = spawn('ffmpeg', [
      '-v', 'warning',
      '-y', // overwrite files without asking
      '-framerate', fps,
      '-start_number', 0, // start compiling from …00.png
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
