#### <sup>:movie_camera: [pellicola](../README.md) → [Documentation](./README.md) → Using custom fonts</sup>

---

## Using custom fonts

When drawing on a `<canvas>` element in a web browser, you can use custom fonts by loading web fonts, just as you would for other fonts on a web page. However, because `pellicola` runs on Node.js we can’t use web font loading to add non-system fonts. Instead, we have to load fonts using `node-canvas`’s [`registerFont` method](registerFont).

To use custom fonts with `pellicola`, we have to pass it an array that provides details of the fonts we want to load:

```js
const pellicola = require('pellicola')

// define the custom fonts we want to load
const myFonts = [
  { family: 'Custom Font', path: 'custom-regular.ttf' }
  { family: 'Custom Font', path: 'custom-bold-italic.ttf', weight: 'bold', style: 'italic' }
]

const sketch = () => ({context}) => {
  context.fillStyle('#f00')
  context.font = '400 36px "Custom Font"'         // use our “Custom Font”
  context.fillText('Some regular text', 10, 40)
  context.font = 'italic bold 24px "Custom Font"' // use our bold-italic font
  context.fillText('Some bold italic text', 10, 100)
}

pellicola(sketch, {
  duration: 1
  fonts: myFonts                                  // provide our fonts to load
})
```

### Font definitions

As shown in the example above, the `fonts` array should contain objects that define each font we want to load. The possible and required properties are as follows:

property | required? | default    | description
---------|:---------:|------------|--------------------------------------------------------------
`family` |     ✔︎     |            | Font family name
`path`   |     ✔︎     |            | Path to the font file to load
`style`  |           | `'normal'` | A string specifying the font style, e.g. `'italic'`
`weight` |           | `'normal'` | A string specifying the font weight, e.g. `'bold'` or `'700'`

See [documentation of the CSS `font` property][css-font] for details of valid `style` and `weight` values and how to construct strings for `context.font` in your sketch.

[registerFont]: https://github.com/Automattic/node-canvas#registerfont
[css-font]: https://developer.mozilla.org/en-US/docs/Web/CSS/font

---

#### <sup>[← Back to Documentation](./README.md)
