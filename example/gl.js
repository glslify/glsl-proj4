import { default as proj } from '../src';
var regl = require('regl')()
var camera = require('regl-camera')(regl, { distance: 10 })

var glsl_constants = require('../lib/constants.glsl')
var glsl_adjust_lon = require('../lib/adjust_lon.glsl')
var glsl_qsfnz = require('../lib/qsfnz.glsl')
var glsl_tsfnz = require('../lib/tsfnz.glsl')
var glsl_asinz = require('../lib/asinz.glsl')
var glsl_phi1z = require('../lib/phi1z.glsl')
var glsl_phi2z = require('../lib/phi2z.glsl')
var glsl_mlfn = require('../lib/mlfn.glsl')

var proj_aea = proj('+proj=aea +lat_1=16 +lat_2=24 +lat_0=19 +lon_0=-157 +x_0=0 +y_0=0'
  + '+ellps=GRS80 +datum=NAD83 +units=m +no_defs')
var proj_lcc = proj('+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs')
var proj_geocent = proj('+proj=geocent +datum=WGS84 +units=m +no_defs')
var proj_tmerc = proj('+proj=tmerc')
//console.log(proj_aea, proj_aea.members('aea'));
console.log(proj_tmerc, proj_tmerc.members('tmerc'));
var mesh = require('./hawaii.json')
var draw = regl({
  frag: `
    precision mediump float;
    void main () {
      gl_FragColor = vec4(0.5,0.5,0.5,1);
    }
  `,
  vert: "precision mediump float;\n" +
  	glsl_constants +
	  glsl_qsfnz +
		glsl_adjust_lon +
		glsl_asinz +
		glsl_phi1z +
		proj_aea.t() +
		proj_aea.forward() +
		proj_aea.inverse() +
	  glsl_tsfnz +
		glsl_phi2z +
		proj_geocent.t() +
		proj_geocent.forward() +
		proj_geocent.inverse() +
		proj_lcc.t() +
		proj_lcc.forward() +
		proj_lcc.inverse() +
		glsl_mlfn +
		proj_tmerc.t() +
		proj_tmerc.forward() +
		proj_tmerc.inverse() +
    `
		uniform aea_t aea;
		uniform geocent_t geocent;
		uniform lcc_t lcc;
		uniform tmerc_t tmerc;
    uniform float aspect;
    attribute vec2 position;
    void main () {
			vec3 p = vec3(position * PI / 180., 0.);
			p = aea_inverse(aea, aea_forward(aea, p));
			p = geocent_inverse(geocent, geocent_forward(geocent, p));
			p = gnom_inverse(gnom, gnom_forward(gnom, p));
			p = lcc_inverse(lcc, lcc_forward(lcc, p));
			p = tmerc_inverse(tmerc, tmerc_forward(tmerc, p));
			p = aea_forward(aea, p);
      gl_Position = vec4(p*1e-6*vec3(1,aspect,1),1);
		}
  `,
  attributes: {
    position: mesh.positions
  },
  uniforms: Object.assign(
		proj_aea.members('aea'),
		proj_geocent.members('geocent'),
		proj_gnom.members('gnom'),
		proj_lcc.members('lcc'),
		proj_tmerc.members('tmerc'),
		{ aspect: function (context) { return context.viewportWidth / context.viewportHeight } }
	),
  elements: mesh.cells
})
regl.frame(function () {
  regl.clear({ color: [1,1,1,1], depth: true })
  draw()
})
