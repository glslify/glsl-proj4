var parse = require('proj4/lib/parseCode')
var ellipsoid = require('proj4/lib/constants/Ellipsoid')
var derive = require('proj4/lib/deriveConstants')

import gnom from './gnom';
import aea from './aea';
import geocent from './geocent';
import tmerc from './tmerc';
import lcc from './lcc';

function glsl_proj(name, strOrProj) {
  var p = strOrProj.projName ? strOrProj : parse(strOrProj);
  var e = ellipsoid[p.ellps || p.datumCode || 'WGS84'] || {};
  if (e && p) e = derive.sphere(e.a, e.b, e.rf, p.ellps, p.sphere);
  var members = null;
  if (p.projName === 'gnom') {
    members = new gnom(p, e);
  } else if (p.projName === 'aea') {
    members = new aea(p, e);
  } else if (p.projName === 'geocent') {
    members = new geocent(p, e);
  } else if (p.projName === 'tmerc') {
    members = new tmerc(p, e);
  } else if (p.projName === 'lcc') {
    members = new lcc(p, e);
  } else return null;

  const uniforms = {};
  Object.keys(members).forEach(function (key) {
    uniforms[name+'.'+key] = members[key]
  })
console.log(p.projName, members.glsl());
  return {
    proj: p,
    uniforms,
    glsl_type: members.glsl_type,
    glsl_forward: members.glsl_forward,
    glsl_inverse: members.glsl_inverse,
    glsl : members.glsl
  }
}

export default glsl_proj;
