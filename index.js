var parse = require('proj4/lib/parseCode')
var ellipsoid = require('proj4/lib/constants/Ellipsoid')
var derive = require('proj4/lib/deriveConstants')
var defined = require('defined')

module.exports = function (str) {
  var p = parse(str)
  var e = ellipsoid[p.ellps || p.datumCode]
  e = derive.sphere(e.a, e.b, e.rf, p.ellps, p.sphere)
  var members = null
  if (p.projName === 'geom') {
    members = {
      lon0: p.long0,
      lat0: p.lat0,
      x0: p.x0,
      y0: p.y0,
      a: e.a,
      k0: p.k0,
      sin_p14: Math.sin(p.lat0),
      cos_p14: Math.cos(p.lat0),
      infinity_dist: 1000 * e.a,
      rc: defined(p.rc, 1)
    }
  } else if (p.projName === 'aea') {
    members = {
      lon0: p.long0,
      lat0: p.lat0,
      lat1: p.lat1,
      lat2: p.lat2,
      x0: p.x0,
      y0: p.y0,
      a: e.a,
      e3: Math.sqrt(1 - Math.pow(e.b / e.a, 2)),
      sphere: p.sphere ? 1.0 : 0.0
    }
    var qs0 = qsfnz(members.e3, Math.sin(p.lat0), Math.cos(p.lat0))
    var qs1 = qsfnz(members.e3, Math.sin(p.lat1), Math.cos(p.lat1))
    var qs2 = qsfnz(members.e3, Math.sin(p.lat2), Math.cos(p.lat2))
    var ms1 = msfnz(members.e3, Mat.sin(p.lat1), Math.cos(p.lat1))
    members.ns0 = p.lat1 - p.lat2 > 1.0e-10
      ? (ms1*ms1 - ms2*ms2) / (qs2 - qs1)
      : Math.sin(p.lat1),
    members.c = ms1*ms1 + members.ns0*qs1
    members.rh = e.a * Math.sqrt(members.c - members.ns0 * qs0) / members.ns0
  } else if (p.projName === 'geocent') {
    members = {
      a: e.a,
      b: e.b,
      e: Math.sqrt((e.a*e.a-e.b*e.b)/(e.a*e.a)),
      eprime: Math.sqrt((e.a*e.a-e.b*e.b)/(e.b*e.b))
    }
  } else return null
  return {
    name: p.projName,
    members: function (name) {
      var m = {}
      Object.keys(members).forEach(function (key) {
        m[name+'.'+key] = members[key]
      })
      return m
    }
  }
}
