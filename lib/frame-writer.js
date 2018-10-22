const { writeFile } = require('fs')
const { join } = require('path')
const validate = require('aproba')
const { directory } = require('tempy')
const { defaultFrameFormat } = require('./constants')

module.exports = FrameWriter
/**
 * Get a FrameWriter instance
 * @return {Object} A FrameWriter instance with write, getDir & done methods
 */
function FrameWriter () {
  const dir = directory()
  const promises = []

  return {
    /**
     * Write a single frame to disk
     * @param   {Buffer} buffer           An image data buffer
     * @param   {Number} frame            The number of the frame we’re saving
     * @param   {Object} [o]              Options object
     * @param   {String} [o.format='png'] Image format to save to
     * @return  {Object} Returns the FrameWriter instance
     */
    write (buffer, frame, { format = defaultFrameFormat } = {}) {
      validate('ON|ONO', arguments)
      const promise = new Promise(function (resolve, reject) {
        const file = `${frame}.${format}`
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
