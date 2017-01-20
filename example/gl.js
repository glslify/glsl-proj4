var regl = require('regl')()
var camera = require('regl-camera')(regl, { distance: 10 })
var glsl = require('glslify')

var proj = require('../')
var p = proj('+proj=aea +lat_1=16 +lat_2=24 +lat_0=19 +lon_0=-157 +x_0=0 +y_0=0'
  + '+ellps=GRS80 +datum=NAD83 +units=m +no_defs')

var mesh = require('./hawaii.json')
var draw = regl({
  frag: `
    precision mediump float;
    void main () {
      gl_FragColor = vec4(0.5,0.5,0.5,1);
    }
  `,
  vert: glsl`
    precision mediump float;
    #pragma glslify: forward = require('../aea/forward')
    #pragma glslify: proj_t = require('../aea/t')
    uniform proj_t proj;
    attribute vec2 position;
    void main () {
      vec3 p = forward(proj, position);
      gl_Position = vec4(p*1e-6,1);
    }
  `,
  attributes: {
    position: mesh.positions
  },
  uniforms: p.members('proj'),
  elements: mesh.cells
})
regl.clear({ color: [1,1,1,1], depth: true })
draw()
