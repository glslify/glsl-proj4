# glsl-proj4

proj4 implementation for glsl

implemented projections:

* aea
* geocent
* gnom
* tmerc

# example

``` js
var regl = require('regl')()
var camera = require('regl-camera')(regl, { distance: 10 })
var glsl = require('glslify')

var proj = require('glsl-proj4')
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
```

# javascript api

``` js
var proj = require('glsl-proj4')
```

## var p = proj(str)

Create a proj instance `p` from a proj4 string `str`.

## p.members(name)

Return an object that maps member keys under the prefix `name` to values. You
can pass this object as a struct uniform

## p.name

String name of the projection.

# glsl api

``` glsl
#pragma glslify: aea_t = require('glsl-proj4/aea/t')
#pragma glslify: aea_forward = require('glsl-proj4/aea/forward')
#pragma glslify: aea_inverse = require('glsl-proj4/aea/inverse')

#pragma glslify: geocent_t = require('glsl-proj4/geocent/t')
#pragma glslify: geocent_forward = require('glsl-proj4/geocent/forward')
#pragma glslify: geocent_inverse = require('glsl-proj4/geocent/inverse')

#pragma glslify: gnom_t = require('glsl-proj4/gnom/t')
#pragma glslify: gnom_forward = require('glsl-proj4/gnom/forward')
#pragma glslify: gnom_inverse = require('glsl-proj4/gnom/inverse')

#pragma glslify: tmerc_t = require('glsl-proj4/tmerc/t')
#pragma glslify: tmerc_forward = require('glsl-proj4/tmerc/forward')
#pragma glslify: tmerc_inverse = require('glsl-proj4/tmerc/inverse')
```

## vec3 proj_foward(proj_t t, vec3 pt)

Forward project `pt` using the parameters from `t`.

## vec3 proj_foward(proj_t t, vec2 pt)

Forward project `pt` using the parameters from `t` with an altitude of 0.

## vec3 proj_inverse(proj_t t, vec3 pt)

Inverse project `pt` using the parameters from `t`.

## vec3 proj_inverse(proj_t t, vec3 pt)

Inverse project `pt` using the parameters from `t` and an altitude of 0.

# install

```
npm install glsl-proj4
```

# license

BSD

Parts of this library were adapted from
[proj4js](https://github.com/proj4js/proj4js).
