var parse = require('proj4/lib/parseCode')
var ellipsoid = require('proj4/lib/constants/Ellipsoid')
var derive = require('proj4/lib/deriveConstants')
var qsfnz = require('proj4/lib/common/qsfnz.js')
var msfnz = require('proj4/lib/common/msfnz.js')
var defined = require('defined')

module.exports = function (str) {
  var p = parse(str)
  var e = ellipsoid[p.ellps || p.datumCode]
  if (e && p) e = derive.sphere(e.a, e.b, e.rf, p.ellps, p.sphere)
  var members = null
  if (p.projName === 'gnom') {
    members = {
      lon0: p.long0/180*Math.PI,
      lat0: p.lat0/180*Math.PI,
      x0: p.x0/180*Math.PI,
      y0: p.y0/180*Math.PI,
      a: defined(p.a,e.a),
      k0: defined(p.k0,1.0),
      sin_p14: Math.sin(p.lat0/180*Math.PI),
      cos_p14: Math.cos(p.lat0/180*Math.PI),
      rc: defined(p.rc, 1)
    }
    members.infinity_dist = 1000 * members.a
  } else if (p.projName === 'aea') {
    members = {
      lon0: p.long0/180*Math.PI,
      lat0: p.lat0/180*Math.PI,
      lat1: p.lat1/180*Math.PI,
      lat2: p.lat2/180*Math.PI,
      x0: p.x0,
      y0: p.y0,
      a: defined(p.a,e.a),
      sphere: p.sphere ? 1.0 : 0.0
    }
    members.e3 = Math.sqrt(1 - Math.pow(defined(p.b,e.b) / members.a, 2))
    var qs0 = qsfnz(members.e3, Math.sin(members.lat0))
    var qs1 = qsfnz(members.e3, Math.sin(members.lat1))
    var qs2 = qsfnz(members.e3, Math.sin(members.lat2))
    var ms1 = msfnz(members.e3, Math.sin(members.lat1),
      Math.cos(members.lat1))
    members.ns0 = members.lat1 - members.lat2 > 1.0e-10
      ? (ms1*ms1 - ms2*ms2) / (qs2 - qs1)
      : Math.sin(members.lat1),
    members.c = ms1*ms1 + members.ns0*qs1
    members.rh = e.a * Math.sqrt(members.c - members.ns0 * qs0) / members.ns0
  } else if (p.projName === 'geocent') {
    var a = defined(p.a,e.a), b = defined(p.b,e.b)
    members = {
      a: a,
      b: b,
      e: Math.sqrt((a*a-b*b)/(a*a)),
      eprime: Math.sqrt((a*a-b*b)/(b*b))
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
