# pellicola

[![npm version](https://img.shields.io/npm/v/pellicola.svg)](https://www.npmjs.com/package/pellicola) [![node](https://img.shields.io/node/v/pellicola.svg)](#) [![Build Status](https://travis-ci.com/delucis/pellicola.svg?branch=latest)](https://travis-ci.com/delucis/pellicola) [![Coverage Status](https://coveralls.io/repos/github/delucis/pellicola/badge.svg?branch=latest)](https://coveralls.io/github/delucis/pellicola?branch=latest) [![Known Vulnerabilities](https://snyk.io/test/npm/pellicola/badge.svg)](https://snyk.io/test/npm/pellicola)

> Generate video files from `<canvas>` animations in Node.js

## Installation

```
npm install --save pellicola
```

## Usage

This package provides a lightweight framework for generating animations with `node-canvas` and saving them as video files using `ffmpeg`.

```js
const pellicola = require('pellicola')

function myAnimation () {
  // provide a function to draw video frames
  return function ({ context, width, height, playhead }) {
    context.fillStyle = '#0f0'
    context.fillRect(0, 0, width * playhead, height)
  }
}

const settings = {
  dimensions: [640, 360],   // video will be 640px wide by 360px tall
  duration: 2,              // video will last 2 seconds
  filename: 'my-sketch.mp4' // set custom filename for output video
}

pellicola(myAnimation, settings)
  .then(path => console.log('Done saving video file to:', path))
  // => Done saving video file to: /path/to/current-dir/my-sketch.mp4
```

Conceptually, `pellicola` uses the idea of the “sketch” that can be found in [Processing](https://processing.org/) and its Javascript cousin [p5.js](https://p5js.org/). The API tries to follow Matt DesLauriers’s [`canvas-sketch`](https://github.com/mattdesl/canvas-sketch) framework, which provides excellent tools for working on generative art with `<canvas>` in the web browser. The aim is to permit a sketch function developed using `canvas-sketch` to be re-used with `pellicola` with minimal adaptation.

For more details, see the [**Documentation →**](docs/README.md)

## License

`pellicola` is distributed under the [GNU General Public License v3.0](LICENSE).
