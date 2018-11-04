const ora = require('ora')

/**
 * Get an `ora` logger or a stub that mocks `ora`’s API
 * @param   {Boolean} [silent=false]  If true returns a stub
 * @return  {Ora|Function} Ora instance or a useless function mocking its API
 */
module.exports = function pellicolaOra ({ silent = false } = {}) {
  if (silent) {
    const model = ora()
    const mock = {}
    Object.getOwnPropertyNames(model.constructor.prototype).forEach(prop => {
      if (typeof model.constructor.prototype[prop] === 'function') {
        mock[prop] = () => {}
      }
    })
    const logger = () => mock
    logger.promise = () => {}
    return logger
  }
  return ora
}
