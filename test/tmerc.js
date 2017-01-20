var glsl = require('glslify')
var forward = require('./lib/forward.js')
var approx = require('./lib/approx.js')
var test = require('tape')

// $ echo 136.1 21.2 | cs2cs +proj=longlat +to +proj=tmerc +lat_0=20 \
// +lon_0=136 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 \
// +units=m +no_defs
// 10382.09  132844.27 0.00

test('tmerc forward', function (t) {
  var p = `+proj=tmerc +lat_0=20 +lon_0=136 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80
    +towgs84=0,0,0,0,0,0,0 +units=m +no_defs`
  var pt = forward(p, [136.1,21.2,0], glsl`
    precision highp float;
    #pragma glslify: forward = require('../tmerc/forward')
    #pragma glslify: proj_t = require('../tmerc/t')
    uniform proj_t proj;
    uniform vec3 pt;
    void main () {
      vec3 pos = forward(proj,pt);
      gl_FragColor = vec4(pos,1);
    }
  `)
  approx(t, pt, [10382.09,132844.27,0])
  t.end()
})

test('tmerc forward inverse forward', function (t) {
  var p = `+proj=tmerc +lat_0=20 +lon_0=136 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80
    +towgs84=0,0,0,0,0,0,0 +units=m +no_defs`
  var pt = forward(p, [136.1,21.2,0], glsl`
    precision highp float;
    #pragma glslify: forward = require('../tmerc/forward')
    #pragma glslify: inverse = require('../tmerc/inverse')
    #pragma glslify: proj_t = require('../tmerc/t')
    uniform proj_t proj;
    uniform vec3 pt;
    void main () {
      vec3 pos = forward(proj,inverse(proj,forward(proj,pt)));
      gl_FragColor = vec4(pos,1);
    }
  `)
  approx(t, pt, [10382.09,132844.27,0])
  t.end()
})
