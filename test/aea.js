var glsl = require('glslify')
var forward = require('./lib/forward.js')
var almost = require('almost-equal')
var test = require('tape')

// echo -155.8758121 19.5478602 \
//  | cs2cs +proj=longlat +to +proj=aea +lat_1=8 +lat_2=18 +lat_0=13 \
//  +lon_0=-157 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs 
// 118304.34 726045.92 0.00

test('aea forward', function (t) {
  var p = `+proj=aea +lat_1=8 +lat_2=18 +lat_0=13 +lon_0=-157 +x_0=0 +y_0=0
    +ellps=GRS80 +datum=NAD83 +units=m +no_defs`
  var pt = forward(p, [-155.8758121,19.5478602,0], glsl`
    precision mediump float;
    #pragma glslify: forward = require('../aea/forward')
    #pragma glslify: proj_t = require('../aea/t')
    uniform proj_t proj;
    uniform vec3 pt;
    void main () {
      vec3 pos = forward(proj,pt);
      gl_FragColor = vec4(pos,1);
    }
  `)
  approx(t, pt, [118304.34,726045.92,0])
  t.end()
})

test('aea forward inverse forward', function (t) {
  var p = `+proj=aea +lat_1=8 +lat_2=18 +lat_0=13 +lon_0=-157 +x_0=0 +y_0=0
    +ellps=GRS80 +datum=NAD83 +units=m +no_defs`
  var pt = forward(p, [-155.8758121,19.5478602,0], glsl`
    precision mediump float;
    #pragma glslify: forward = require('../aea/forward')
    #pragma glslify: inverse = require('../aea/inverse')
    #pragma glslify: proj_t = require('../aea/t')
    uniform proj_t proj;
    uniform vec3 pt;
    void main () {
      vec3 pos = forward(proj,inverse(proj,forward(proj,pt)));
      gl_FragColor = vec4(pos,1);
    }
  `)
  approx(t, pt, [118304.34,726045.92,0])
  t.end()
})

function approx (t, a, b) {
  var ep = Math.pow(2,Math.log(a[0])/Math.log(2)-17)
  t.ok(almost(a[0], b[0], ep), `${a[0]} cmp ${b[0]}`)
  t.ok(almost(a[1], b[1], ep), `${a[1]} cmp ${b[1]}`)
}
