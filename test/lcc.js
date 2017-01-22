var glsl = require('glslify')
var forward = require('./lib/forward.js')
var approx = require('./lib/approx.js')
var test = require('tape')

// $ echo -96.4 40.2 | cs2cs +proj=longlat +to \
// +proj=lcc +lat_1=33 +lat_2=45 +lat_0=39 +lon_0=-96
// -33878.01 132587.16 0.00

test('lcc forward', function (t) {
  var p = '+proj=lcc +lat_1=33 +lat_2=45 +lat_0=39 +lon_0=-96'
  var pt = forward(p, [-96.4,40.2,0], glsl`
    precision highp float;
    #pragma glslify: forward = require('../lcc/forward')
    #pragma glslify: proj_t = require('../lcc/t')
    uniform proj_t proj;
    uniform vec3 pt;
    void main () {
      vec3 pos = forward(proj,pt);
      gl_FragColor = vec4(pos,1);
    }
  `)
  approx(t, pt, [-33878.01,132587.16,0])
  t.end()
})

test('lcc forward inverse forward', function (t) {
  var p = '+proj=lcc +lat_1=33 +lat_2=45 +lat_0=39 +lon_0=-96'
  var pt = forward(p, [-96.4,40.2,0], glsl`
    precision highp float;
    #pragma glslify: forward = require('../lcc/forward')
    #pragma glslify: inverse = require('../lcc/inverse')
    #pragma glslify: proj_t = require('../lcc/t')
    uniform proj_t proj;
    uniform vec3 pt;
    void main () {
      vec3 pos = forward(proj,inverse(proj,forward(proj,pt)));
      gl_FragColor = vec4(pos,1);
    }
  `)
  approx(t, pt, [-33878.01,132587.16,0])
  t.end()
})
