var glsl = require('glslify')
var forward = require('./lib/forward.js')
var approx = require('./lib/approx.js')
var test = require('tape')

// $ echo -149.90 61.22 0 | cs2cs +proj=longlat +to +proj=ortho +datum=WGS84 +units=m +no_defs \
//   +k_0=1.500000e-7 +x_0=-3.26e+3 +y_0=2.34e+4 +lon_0=-95.2 +lat_0=20.1
// -2515875.25	4653916.83 0.00
// # ^ cs2cs does not support k_0 for proj=ortho but we do
// multiplying x and y by 1.5e-7 we get: -0.3773812875 0.6980875245

test('ortho forward', function (t) {
  var p = `+proj=ortho +datum=WGS84 +units=m +no_defs 
    +k_0=1.500000e-7 +x_0=-3.26e+3 +y_0=2.34e+4 +lon_0=-95.2 +lat_0=20.1`
  var pt = forward(p, [-149.90,61.22,0], glsl`
    precision highp float;
    #pragma glslify: forward = require('../ortho/forward')
    #pragma glslify: proj_t = require('../ortho/t')
    uniform proj_t proj;
    uniform vec3 pt;
    void main () {
      vec3 pos = forward(proj,pt);
      gl_FragColor = vec4(pos,1);
    }
  `)
  approx(t, pt, [-0.3773812875,0.6980875245,0.03821655362844467])
  t.end()
})

test('ortho forward inverse forward', function (t) {
  var p = `+proj=ortho +datum=WGS84 +units=m +no_defs 
    +k_0=1.500000e-7 +x_0=-3.26e+3 +y_0=2.34e+4 +lon_0=-95.2 +lat_0=20.1`
  var pt = forward(p, [-149.90,61.22,0], glsl`
    precision highp float;
    #pragma glslify: forward = require('../ortho/forward')
    #pragma glslify: inverse = require('../ortho/inverse')
    #pragma glslify: proj_t = require('../ortho/t')
    uniform proj_t proj;
    uniform vec3 pt;
    void main () {
      vec3 pos = forward(proj,inverse(proj,forward(proj,pt)));
      gl_FragColor = vec4(pos,1);
    }
  `)
  approx(t, pt, [-0.3773812875,0.6980875245,-0.730804979801178])
  t.end()
})

// # coordinates on the other side of the planet should be inf:
// $ echo -149.90 61.22 500 | cs2cs +proj=longlat +to +proj=ortho +datum=WGS84 +units=m +no_defs \
//   +lon_0=0 +lat_0=0
// *	* inf
test('ortho forward inf', function (t) {
  var p = `+proj=ortho +datum=WGS84 +units=m +no_defs +lon_0=180 +lat_0=0`
  var pt = forward(p, [-149.90,61.22,0], glsl`
    precision highp float;
    #pragma glslify: forward = require('../ortho/forward')
    #pragma glslify: proj_t = require('../ortho/t')
    uniform proj_t proj;
    uniform vec3 pt;
    void main () {
      vec3 pos = forward(proj,pt);
      gl_FragColor = vec4(pos,1);
    }
  `)
  t.ok(pt[2] < 0.0, 'z is negative (on the other side of the globe)')
  t.end()
})
