/**
 * These constants are used in various places and storing them centrally helps
 * keep track of what they are
 * @type {{
 *   defaultFrameRate: number;
 *   defaultFrameFormat: 'png' | 'jpeg';
 *   possibleFrameFormats: ('png' | 'jpeg')[]
 * }}
 */
module.exports = {
  defaultFrameRate: 24,
  defaultFrameFormat: 'png',
  possibleFrameFormats: ['png', 'jpeg']
}
