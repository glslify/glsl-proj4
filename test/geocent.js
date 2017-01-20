var glsl = require('glslify')
var forward = require('./lib/forward.js')
var approx = require('./lib/approx.js')
var test = require('tape')

// echo -155.8758121 19.5478602 | cs2cs +proj=longlat +to +proj=geocent
// -5487624.63 -2457513.85 2120595.72

test('geocent forward', function (t) {
  var p = '+proj=geocent'
  var pt = forward(p, [-155.8758121,19.5478602,0], glsl`
    precision mediump float;
    #pragma glslify: forward = require('../geocent/forward')
    #pragma glslify: proj_t = require('../geocent/t')
    uniform proj_t proj;
    uniform vec3 pt;
    void main () {
      vec3 pos = forward(proj,pt);
      gl_FragColor = vec4(pos,1);
    }
  `)
  approx(t, pt, [-5487624.63,-2457513.85,2120595.72])
  t.end()
})

test('aea forward inverse forward', function (t) {
  var p = '+proj=geocent'
  var pt = forward(p, [-155.8758121,19.5478602,0], glsl`
    precision mediump float;
    #pragma glslify: forward = require('../geocent/forward')
    #pragma glslify: inverse = require('../geocent/inverse')
    #pragma glslify: proj_t = require('../geocent/t')
    uniform proj_t proj;
    uniform vec3 pt;
    void main () {
      vec3 pos = forward(proj,inverse(proj,forward(proj,pt)));
      gl_FragColor = vec4(pos,1);
    }
  `)
  approx(t, pt, [-5487624.63,-2457513.85,2120595.72])
  t.end()
})
