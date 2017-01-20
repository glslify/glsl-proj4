var glsl = require('glslify')
var forward = require('./lib/forward.js')
var approx = require('./lib/approx.js')
var test = require('tape')

// $ echo -115.2 72.5 | cs2cs +proj=longlat +to +proj=gnom +lat_0=90 +lon_0=0 \
// +x_0=6300000 +y_0=6300000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs
// 4480375.72  7156250.19 0.00

test('gnom forward', function (t) {
  var p = `+proj=gnom +lat_0=90 +lon_0=0 +x_0=6300000 +y_0=6300000 +ellps=WGS84
    +datum=WGS84 +units=m +no_defs`
  var pt = forward(p, [-115.2,72.5,0], glsl`
    precision highp float;
    #pragma glslify: forward = require('../gnom/forward')
    #pragma glslify: proj_t = require('../gnom/t')
    uniform proj_t proj;
    uniform vec3 pt;
    void main () {
      vec3 pos = forward(proj,pt);
      gl_FragColor = vec4(pos,1);
    }
  `)
  approx(t, pt, [4480375.72,7156260.19,0])
  t.end()
})

test('gnom forward inverse forward', function (t) {
  var p = `+proj=gnom +lat_0=90 +lon_0=0 +x_0=6300000 +y_0=6300000 +ellps=WGS84
    +datum=WGS84 +units=m +no_defs`
  var pt = forward(p, [-115.2,72.5,0], glsl`
    precision highp float;
    #pragma glslify: forward = require('../gnom/forward')
    #pragma glslify: inverse = require('../gnom/inverse')
    #pragma glslify: proj_t = require('../gnom/t')
    uniform proj_t proj;
    uniform vec3 pt;
    void main () {
      vec3 pos = forward(proj,inverse(proj,forward(proj,pt)));
      gl_FragColor = vec4(pos,1);
    }
  `)
  approx(t, pt, [4480375.72,7156260.19,0])
  t.end()
})
