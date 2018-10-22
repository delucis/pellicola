# pellicule

[![npm version](https://img.shields.io/npm/v/pellicule.svg)](https://www.npmjs.com/package/pellicule) [![Build Status](https://travis-ci.com/delucis/pellicule.svg?branch=master)](https://travis-ci.com/delucis/pellicule) [![Coverage Status](https://coveralls.io/repos/github/delucis/pellicule/badge.svg?branch=master)](https://coveralls.io/github/delucis/pellicule?branch=master) [![Known Vulnerabilities](https://snyk.io/test/npm/pellicule/badge.svg)](https://snyk.io/test/npm/pellicule) ![Greenkeeper badge](https://badges.greenkeeper.io/delucis/pellicule.svg)

> Generate video files from `<canvas>` animations in Node.js

## Installation

```
npm install --save pellicule
```

## Usage

This package provides a lightweight framework for saving animations generated using `node-canvas` as video files using `ffmpeg`.

```js
const pellicule = require('pellicule')

function myAnimation () {
  return function ({ context, width, height, playhead }) {
    // set our fill colour to bright green
    context.fillStyle = '#0f0'
    
    // draw a rectangle that gradually fills the frame from left to right using
    // the playhead variable, which moves from 0 to 1 over the course of the
    // animation’s duration
    context.fillRect(0, 0, width * playhead, height)
  }
}

const settings = {
  dimensions: [640, 360],   // animation will be 640px wide by 360px tall
  duration: 2,              // animation will last 2 seconds
  filename: 'my-sketch.mp4' // set custom filename for output video
}

pellicule(myAnimation, settings)
  .catch(e => console.error(e))
  .then(path => console.log('Done saving video file to:', path))
  // => Done saving video file to: /path/to/current-directory/my-sketch.mp4
```

Conceptually, `pellicule` uses the idea of the “sketch” that can be found in [Processing](https://processing.org/) and its Javascript cousin [p5.js](https://p5js.org/). The API tries to follow Matt DesLauriers’s [`canvas-sketch`](https://github.com/mattdesl/canvas-sketch) framework, which provides excellent tools for working on generative art with `<canvas>` in the web browser. The aim is to permit a sketch function developed using `canvas-sketch` to be re-used with `pellicule` with minimal adaptation.

## License

`pellicule` is distributed under the [GNU General Public License v3.0](LICENSE).
