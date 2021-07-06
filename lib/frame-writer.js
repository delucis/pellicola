const { writeFile } = require('fs')
const { join } = require('path')
const validate = require('aproba')
const { directory } = require('tempy')

module.exports = FrameWriter

/**
 * @typedef {{
 *   write: (buffer: Buffer, frame: number) => FrameWriterInstance;
 *   getDir: () => string;
 *   done: () => Promise<string[]>
 * }} FrameWriterInstance
 */

/**
 * Get a FrameWriter instance
 * @param  {'png'|'jpeg'} frameFormat Image format to save to
 * @return {FrameWriterInstance} A FrameWriter instance with write, getDir & done methods
 */
function FrameWriter (frameFormat) {
  validate('S', arguments)
  const dir = directory()
  const promises = []

  return {
    /**
     * Write a single frame to disk
     * @param   {Buffer} buffer     An image data buffer
     * @param   {number} frame      The number of the frame we’re saving
     * @return  {FrameWriterInstance} Returns the FrameWriter instance
     */
    write (buffer, frame) {
      validate('ON', arguments)
      const promise = new Promise(function (resolve, reject) {
        const file = `${frame}.${frameFormat}`
        const path = join(dir, file)
        writeFile(path, buffer, error => {
          if (error) reject(error)
          resolve(path)
        })
      })
      promises.push(promise)
      return this
    },

    /**
     * Get the path to the temporary directory being written to
     * @return  {String}  Temporary directory path
     */
    getDir () {
      return dir
    },

    /**
     * Returns a promise for all the write tasks managed by this FrameWriter
     * @return {Promise<String[]>} Resolves to an array of file paths
     */
    done () {
      return Promise.all(promises)
    }
  }
}
