var parse = require('proj4/lib/parseCode')
var ellipsoid = require('proj4/lib/constants/Ellipsoid')
var derive = require('proj4/lib/deriveConstants')

import gnom from './gnom';
import aea from './aea';
import geocent from './geocent';
import tmerc from './tmerc';
import lcc from './lcc';

function glsl_proj(str) {
  var p = parse(str)
  var e = ellipsoid[p.ellps || p.datumCode || 'WGS84'] || {}
  if (e && p) e = derive.sphere(e.a, e.b, e.rf, p.ellps, p.sphere)
  var members = null
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
  } else return null
  return {
    name: p.projName,
    members: function (name) {
      var m = {}
      Object.keys(members).forEach(function (key) {
        m[name+'.'+key] = members[key]
      })
      return m
    },
		t: members.t,
		forward: members.forward,
		inverse: members.inverse
  }
}

export default glsl_proj;
