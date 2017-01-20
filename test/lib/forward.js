var regl = require('regl')({ extensions: ['OES_texture_float'] })
var proj = require('../../')

module.exports = function forward (str, pt, frag) {
  var p = proj(str)
  var draw = regl({
    frag: frag,
    vert: `
      precision mediump float;
      attribute vec2 position;
      void main () {
        gl_Position = vec4(position,0,1);
      }
    `,
    attributes: { position: [0,0] },
    elements: [[0]],
    uniforms: Object.assign(p.members('proj'), { pt: pt }),
    framebuffer: regl.prop('framebuffer')
  })
  var fb = regl.framebuffer({
    width: 1,
    height: 1,
    colorFormat: 'rgba',
    colorType: 'float32'
  })
  var result
  draw({ framebuffer: fb }, function () {
    regl.draw()
    var data = regl.read({ data: new Float32Array(4) })
    result = [data[0],data[1],data[2]]
  })
  return result
}
